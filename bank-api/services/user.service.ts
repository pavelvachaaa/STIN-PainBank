import { Service, Inject, Container } from "typedi";
import UserRepository from "../repositories/user.repository.js";
import IUserRepository from "../interfaces/UserRepository.interface.js";
import IUser from "../models/IUser.js";
import hash from "../vendor/pavel_vacha/utils/auth.util.js";
import IAccountRepository from "../interfaces/AccountRepository.interface.js";
import AccountRepository from "../repositories/account.repository.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
import CreateUserDto from "../dtos/create_user.dto.js";


@Service()
class UserService {
    private userRepo: IUserRepository;
    private accountRepo: IAccountRepository;
    constructor(userRepo: UserRepository, accountRepo: AccountRepository) {
        this.userRepo = userRepo;
        this.accountRepo = accountRepo;
    }

    register = async (user: CreateUserDto) => {
        if (await this.userRepo.findByEmail(user.email)) {
            throw new AppError({ description: "Uživatel  již existuje", httpCode: HttpCode.BAD_REQUEST, isOperational: true });
        }

        user.password = hash(user.password);

        const createdUser: IUser = await this.userRepo.save(user);
        const res = await this.accountRepo.open({ email: user.email, currency: "CZK" });

        // TODO: Případně rollbacky, ale na to sere pes docela
        if (!res) {
            throw new AppError({ description: "Omlouváme se, nepodařilo se nám Vám otevřít účet", httpCode: HttpCode.BAD_REQUEST, isOperational: true });
        }

        return createdUser;
    };
}


export default UserService;