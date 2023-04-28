import { Request, Response } from "express";
import { Service } from "typedi";
import UserService from "../services/user.service.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import AuthService from "../services/auth.service.js";
import AccountService from "../services/account.service.js";
import { ApiResponse } from "../vendor/pavel_vacha/interfaces/ApiResponse.interface.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
import OpenAccountDTO from "../dtos/open_account.dto.js";
import WithdrawDto from "../dtos/withdraw_dto.js";
import DepositDto from "../dtos/deposit_dto.js";


@Service()
class AccountController {
    private readonly userService;
    private readonly authService;
    private readonly accountService

    constructor(userService: UserService, authService: AuthService, accountService: AccountService) {
        this.userService = userService;
        this.authService = authService;
        this.accountService = accountService;
    }

    async open(_req: CustomRequest, res: Response) {
        const dto: OpenAccountDTO = _req.body;
        console.log(dto.email, _req.userData)
        if (_req.userData.email !== dto.email) {
            throw new AppError({
                description: "K tomuto prostředku nemáte přístup!",
                httpCode: HttpCode.FORBIDEN,
                name: "ACCOUNT_CONTROLLER",
                isOperational: true
            });
        }

        const result = await this.accountService.open(dto);
        return new ApiResponse({ data: result, message: "Vytvořili jsme vám účet" }).send(res);
    }

    async close(_req: CustomRequest, res: Response) {
        throw new Error("Method not implemented.");
    }

    async withdraw(_req: CustomRequest, res: Response) {
        /// TODO: Check resources
        const dto: WithdrawDto = _req.body;
        const result = await this.accountService.withdraw(dto);

        return new ApiResponse({ data: result, message: "Úspěšně jste vybrali peníze z účtu" }).send(res);
    }
    async getUserAccounts(_req: CustomRequest, res: Response) {
        const { email }: { email: string } = _req.body;
        if (_req.userData.email !== email) {
            throw new AppError({
                description: "K tomuto prostředku nemáte přístup!",
                httpCode: HttpCode.FORBIDEN,
                name: "ACCOUNT_CONTROLLER",
                isOperational: true
            });
        }

        const result = await this.accountService.getAccounts(email);

        return new ApiResponse({ data: result, message: "Vracíme váše účty" }).send(res);
    }

    async deposit(_req: CustomRequest, res: Response) {
        ///TODO: Check resources -> obecná metoda
        const dto: DepositDto = _req.body;
        const result = await this.accountService.deposit(dto);

        return new ApiResponse({ data: result, message: "Úspěšně jsme vám připsali peníze na účet" }).send(res);
    }

    async history(_req: CustomRequest, res: Response) {
        throw new Error("Method not implemented.");
    }

}

export default AccountController;