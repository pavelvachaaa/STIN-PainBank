import IAuthRequestRepository from "../interfaces/AuthRequestRepository.interface.js";
import IUserRepository from "../interfaces/UserRepository.interface.js";
import IAuthRequest from "../models/IAuthRequest.js";
import IUser from "../models/IUser.js";
import AuthRequestRepository from "../repositories/auth_requests.repository.js";
import UserRepository from "../repositories/user.repository.js";
import jwt, { Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import hash from "../vendor/pavel_vacha/utils/auth.util.js";
import { Service } from "typedi";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
import StartAuthDto from "../dtos/start_auth.dto.js";
import AuthenticateDto from "../dtos/authenticate.dto.js";
import sendMail from "../utils/mail.util.js";

@Service()
class AuthService {

    private userRepo: IUserRepository;
    private authRepo: IAuthRequestRepository;

    constructor(userRepo: UserRepository, authRepo: AuthRequestRepository) { // and here
        this.userRepo = userRepo;
        this.authRepo = authRepo;
    }

    async startAuthentication(user: StartAuthDto) {
        const dbUser: IUser = await this.userRepo.findByEmail(user.email);
        user.password = hash(user.password);

        if (!dbUser) {
            throw new AppError({
                description: "Neplatné přihlašovací údaje",
                name: "AUTH_SERVICE",
                httpCode: HttpCode.BAD_REQUEST,
            });
        }

        if (dbUser.password === user.password && dbUser.email === user.email) {
            const code = Math.floor(Math.random() * 10000);
            const authRequest: IAuthRequest = {
                attempts_remaining: 3,
                auth_request_id: uuidv4(),
                email: dbUser.email,
                code: code,
                expires_at: Date.now() + 60 * 5 * 1000
            }

            await this.authRepo.save(authRequest);
            sendMail({ to: dbUser.email, code: code });

            return { auth_request_id: authRequest.auth_request_id }
        } else {
            throw new AppError({
                description: "Neplatné přihlašovací údaje",
                name: "AUTH_SERVICE",
                httpCode: HttpCode.BAD_REQUEST,
            });
        }
    }

    authenticate = async (data: AuthenticateDto) => {
        const auth_request: IAuthRequest = await this.authRepo.findById(data.auth_request_id);
        if (!auth_request) {
            throw new AppError({
                description: "Neplatný požadavek na přhilášení",
                name: "AUTH_SERVICE",
                httpCode: HttpCode.BAD_REQUEST,
            });
        }

        if (auth_request.expires_at < Date.now()) {
            throw new AppError({
                description: "Váš požadavek pro přihlášení je po expiraci",
                name: "AUTH_SERVICE",
                httpCode: HttpCode.BAD_REQUEST
            });
        }

        const user: IUser = await this.userRepo.findByEmail(auth_request.email);
        if (auth_request.code === data.code && auth_request.attempts_remaining > 0) {
            const token = jwt.sign({ email: user.email, name: user.name }, process.env.SECRET_KEY as Secret, {
                expiresIn: '2 days',
            });

            await this.authRepo.remove(data.auth_request_id);

            return { user: { email: user.email, name: user.name }, token: token };

        } else {
            if (auth_request.attempts_remaining - 1 <= 0) {
                await this.authRepo.remove(data.auth_request_id);

                throw new AppError({
                    description: "Překročili jste počet pokusů, váš účet byl zablokován.",
                    name: "AUTH_SERVICE",
                    httpCode: HttpCode.BAD_REQUEST
                });
            } else {
                auth_request.attempts_remaining--;
                await this.authRepo.update(auth_request);

                throw new AppError({
                    description: "Zadali jste neplatný kód",
                    name: "AUTH_SERVICE",
                    httpCode: HttpCode.BAD_REQUEST
                });
            }
        }


    }

}

export default AuthService;
export default AuthService;