import { Request, Response } from "express";
import UserController from "../../controllers/user.controller.js";
import UserService from "../../services/user.service.js";
import { expect, jest, test } from '@jest/globals';
import { AppError } from "../../vendor/pavel_vacha/exceptions/AppError.js";
import { HttpCode } from "../../vendor/pavel_vacha/exceptions/AppError.js";
import AccountController from "../../controllers/account.controller.js";
import CurrencyController from "../../controllers/currency.controller.js";
import MockData from "../../MockData.js";

describe("CurrencyController", () => {
    let currencyServiceMock: any;
    let currencyController: CurrencyController;
    let req: any;
    let res: any;

    beforeEach(() => {
        currencyServiceMock = {
            getLastList: jest.fn(() => MockData.currencies),
        };

        currencyController = new CurrencyController(currencyServiceMock);

        req = { body: {} };
        res = {
            send: jest.fn(),
            status: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getLastList', () => {
        it('should return the last currency list with a success message', async () => {
         
            const response = await currencyController.getLastList(req, res);

            expect(currencyServiceMock.getLastList).toHaveBeenCalled();
            expect(currencyServiceMock.getLastList).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(HttpCode.OK)
        });
    });

});

