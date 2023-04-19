import { Request, Response } from "express";
import { Service } from "typedi";
import UserService from "../services/user.service.js";
import AuthService from "../services/auth.service.js";
import { ApiResponse } from "../vendor/pavel_vacha/interfaces/ApiResponse.interface.js";
import StartAuthDto from "../dtos/start_auth.dto.js";
import AuthenticateDto from "../dtos/authenticate.dto.js";


@Service()
class AuthController {
    private readonly userService;
    private readonly authService;

    constructor(userService: UserService, authService: AuthService) {
        this.userService = userService;
        this.authService = authService;
    }

    async startAuthentication(_req: Request, res: Response) {
        const user: StartAuthDto = _req.body;
        const result = await this.authService.startAuthentication(user);

        return new ApiResponse({ message: "Odeslali jsme Vám požadavek na e-mail. Zkontrolujte si prosím i SPAM složku", data: result }).send(res);
    }

    async authenticate(_req: Request, res: Response) {
        const data: AuthenticateDto = _req.body;
        const result = await this.authService.authenticate(data);

        return new ApiResponse({ message: "Úspěšně jsme vás přihlásili", data: result }).send(res);
    }

}

export default AuthController;