import { jest } from '@jest/globals'
import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { auth, CustomRequest } from '../../middlewares/auth.middleware.js';
import { AppError, HttpCode } from '../../vendor/pavel_vacha/exceptions/AppError.js';
import dotenv from 'dotenv';
dotenv.config();

describe('auth middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn() as any,
        };
    });

    test("without headers", async () => {
        await expect(auth(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )).rejects.toThrow(AppError);

    });

    test('without "authorization" header', async () => {

        mockRequest = {
            headers: {},
        };

        try {
            await auth(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );
        } catch (e) {
            expect((e as AppError).httpCode).toBe(HttpCode.UNAUTHORIZED)
        }

    });

    test('with correct "authorization" header', async () => {

        const token = jwt.sign({ email: 'test@example.com', _id: '123' }, process.env.SECRET_KEY as Secret);

        mockRequest = {
            headers: {
                authorization: `Bearer ${token}`
            },
        };
        console.log(process.env.SECRET_KEY)
        console.log(token)

        await auth(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalledTimes(1);
    });

    test('with incorrect "authorization" header', async () => {

        const token = jwt.sign({ email: 'test@example.com', _id: '123' }, "NEPLATNY_KLIC");

        mockRequest = {
            headers: {
                authorization: `Bearer ${token}`
            },
        };
        console.log(process.env.SECRET_KEY)
        console.log(token)

        await expect(auth(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        )).rejects.toThrow(AppError)


    });

    // it('should throw an error if there is no token in the Authorization header', () => {
    //     expect(auth(req, res, next)).toThrow(AppError);
    //     // try {
    //     //     auth(req, res, next)
    //     // } catch(e) {
    //     //     expect(e).toBeInstanceOf(Error)
    //     // }

    // });

    // it('should set userData on the request object if the token is valid', () => {
    //     const token = jwt.sign({ email: 'test@example.com', _id: '123' }, process.env.SECRET_KEY as Secret);
    //     req.headers = { authorization: `Bearer ${token}` };

    //     auth(req, res, next);

    //     expect((req as CustomRequest).userData).toEqual({ email: 'test@example.com', _id: '123' });
    //     expect(next).toHaveBeenCalledTimes(1);
    // });

    // it('should throw an AppError with UNAUTHORIZED httpCode if the token is invalid', () => {
    //     const invalidToken = 'invalid.token';
    //     req.headers = { authorization: `Bearer ${invalidToken}` };

    //     expect(() => {
    //         auth(req, res, next);
    //     }).toThrow('Prosím, nejdříve se přihlašte.');
    // });
});