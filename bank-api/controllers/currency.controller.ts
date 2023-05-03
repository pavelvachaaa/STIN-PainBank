import { Request, Response } from "express";
import { Service } from "typedi";
import UserService from "../services/user.service.js";
import { ApiResponse } from "../vendor/pavel_vacha/interfaces/ApiResponse.interface.js";
import CreateUserDto from "../dtos/create_user.dto.js";
import CurrencyService from "../services/currency.service.js";

@Service()
class CurrencyController {
    private readonly currencyService;

    constructor(currencyService: CurrencyService) {
        this.currencyService = currencyService;
    }

    async getLastList(_req: Request, res: Response) {
        const result = await this.currencyService.getLastList();
        return new ApiResponse({ data: result, message: "Vracíme kurzovní lístek" }).send(res);
    }
}

export default CurrencyController;