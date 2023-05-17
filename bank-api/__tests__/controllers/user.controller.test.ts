import { Request, Response } from "express";
import UserController from "../../controllers/user.controller.js";
import UserService from "../../services/user.service.js";
import { expect, jest, test } from '@jest/globals';
import { AppError } from "../../vendor/pavel_vacha/exceptions/AppError.js";
import { HttpCode } from "../../vendor/pavel_vacha/exceptions/AppError.js";

describe("UserController", () => {
    let userServiceMock: any;
    let userController: UserController;
    let req: any;
    let res: any;

    beforeEach(() => {
        userServiceMock = {
            register: jest.fn(),
        };

        userController = new UserController(userServiceMock);

        req = { body: { "to": "mrdej" } };
        res = {
            send: jest.fn(),
            status: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("should register a user and send a response", async () => {

            req.body = {
                name: "Jméno",
                password: "heslo",
                email: "pavel.vachaa@gmail.com"
            }

            const expectedResult = {
                "name": "Jméno",
                "password": "VrHbgTPZ6zmKq9N28Hv4q1/FhOoLi9ahdwIAy2E8oAU=",
                "email": "apavel.vachaa@gmail.com",
                "accounts": [
                    {
                        "account_id": "1501205675755076",
                        "balance": 0,
                        "currency": "CZK"
                    }
                ]
            }
            userServiceMock.register.mockResolvedValue(expectedResult);

            await userController.register(req, res);

            expect(userServiceMock.register).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HttpCode.OK)
        });


    });
});

