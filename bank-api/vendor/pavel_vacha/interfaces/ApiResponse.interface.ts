import { HttpCode } from "../exceptions/AppError.js";
import { Response } from 'express';

interface IApiResponse {
    errors?: any[];
    responseCode?: HttpCode;
    message: string;
    data?: unknown;
}

export class ApiResponse {
    errors?: any[];
    responseCode?: HttpCode;
    message: string;
    data?: unknown;

    constructor(args: IApiResponse) {
        this.message = args.message ?? "";
        this.data = args.data ?? [];
        this.errors = args.errors ?? [];
        this.responseCode = args.responseCode ?? HttpCode.OK;
    }

    send(res: Response): void {
        res.status(this.responseCode ?? 200)?.send(this);
        return;
    }

}