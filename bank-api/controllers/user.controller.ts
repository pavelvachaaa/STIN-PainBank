import { Request, Response } from "express";
import { Service } from "typedi";
import UserService from "../services/user.service.js";
import IUser from "../models/IUser.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import CurrencyRepository from "../repositories/currency.repository.js";
import { ApiResponse } from "../vendor/pavel_vacha/interfaces/ApiResponse.interface.js";
import CreateUserDto from "../dtos/create_user.dto.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";

@Service()
class UserController {
    private readonly userService;
    private readonly curRepo;

    constructor(userService: UserService, curRepo: CurrencyRepository) {
        this.userService = userService;
        this.curRepo = curRepo;
    }

    async register(_req: Request, res: Response) {
        const user: CreateUserDto = _req.body as CreateUserDto;
        const result = await this.userService.register(user);

        return new ApiResponse({ data: result, message: "Úspěšně jsme Vás zaregistrovali do naší banky" }).send(res);
    }
}

export default UserController;