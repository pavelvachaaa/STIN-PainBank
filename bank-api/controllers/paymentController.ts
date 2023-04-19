import { Request, Response } from "express";
import { Service } from "typedi";
import UserService from "../services/user.service.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import AuthService from "../services/auth.service.js";
import AccountService from "../services/account.service.js";
import PaymentService from "../services/payment.service.js";


@Service()
class PaymentController {
    private readonly userService;
    private readonly authService;
    private readonly accountService;
    private readonly paymentService;

    constructor(userService: UserService, authService: AuthService, accountService: AccountService, paymentService: PaymentService) {
        this.userService = userService;
        this.authService = authService;
        this.accountService = accountService;
        this.paymentService = paymentService;
    }

    async history(_req: CustomRequest, res: Response) {
        throw new Error("Method not implemented.");
    }

}

export default PaymentController;