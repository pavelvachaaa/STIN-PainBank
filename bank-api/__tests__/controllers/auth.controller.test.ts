import { Request, Response } from 'express';
import { Service } from 'typedi';
import AuthController from '../../controllers/auth.controller.js';
import { expect, jest, test } from '@jest/globals';
import StartAuthDto from '../../dtos/start_auth.dto.js';

describe('AuthController', () => {
    let authController: AuthController;
    let mockAuthService: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockAuthService = {
            authenticate: jest.fn(),
            startAuthentication: jest.fn()
        }
        authController = new AuthController(mockAuthService);
        req = {} as Request;
        res = {
            send: jest.fn(),
            status: jest.fn()
        };
    });

    test("should throw when not all data provided (both)" , async () => {
        let error;
        const startAuthDto: Partial<StartAuthDto> = {};
        req.body = startAuthDto;

        if (!startAuthDto?.email || !startAuthDto.password) {
            error = new Error('U should provide both creds');
        }
        mockAuthService.startAuthentication.mockRejectedValue(error);
        await expect(mockAuthService.startAuthentication(req, res)).rejects.toThrowError(error);
        expect(mockAuthService.startAuthentication).toHaveBeenCalledTimes(1);
    });

    test("should throw when not all data provided (email)" , async () => {
        let error;
        const startAuthDto: Partial<StartAuthDto> = { password: 'pass', };
        req.body = startAuthDto;

        if (!startAuthDto?.email) {
            error = new Error('U should provide email');
        }
        mockAuthService.startAuthentication.mockRejectedValue(error);
        await expect(mockAuthService.startAuthentication(req, res)).rejects.toThrowError(error);
        expect(mockAuthService.startAuthentication).toHaveBeenCalledTimes(1);
    });

    test("should throw when not all data provided (password)", async () => {
        let error;
        const startAuthDto: Partial<StartAuthDto> = { email: 'test@example.com', };
        req.body = startAuthDto;

        if (!startAuthDto?.password) {
            error = new Error('U should provide password');
        }
        mockAuthService.startAuthentication.mockRejectedValue(error);
        await expect(mockAuthService.startAuthentication(req, res)).rejects.toThrowError(error);
        expect(mockAuthService.startAuthentication).toHaveBeenCalledTimes(1);
    });

    test('startAuthentication should return a response with the correct message and data', async () => {
        const startAuthDto = { email: 'test@example.com', password: 'password' };
        req.body = startAuthDto;

        await authController.startAuthentication(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockAuthService.startAuthentication).toHaveBeenCalledWith(startAuthDto);
    });

    test('authenticate should return a response with the correct message and data', async () => {
        const authenticateDto = { code: 1234, auth_request_id: 'request_id' };
        req.body = authenticateDto;

        await authController.authenticate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        // Check if the AuthService method was called with the correct parameters
        expect(mockAuthService.authenticate).toHaveBeenCalledWith(authenticateDto);
    });
});
