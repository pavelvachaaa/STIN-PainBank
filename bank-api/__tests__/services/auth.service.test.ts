import MockData from "../../MockData.js";
import AuthRequestRepository from "../../repositories/auth_requests.repository.js";
import UserRepository from "../../repositories/user.repository.js";
import AuthService from "../../services/auth.service.js";
import sendMail from "../../utils/mail.util.js";
import { AppError, HttpCode } from "../../vendor/pavel_vacha/exceptions/AppError.js";
import { expect, jest, test } from '@jest/globals';



describe('AuthService', () => {
    jest.mock('jsonwebtoken', () => ({
        sign: jest.fn(),
    }));

    jest.mock('../../utils/mail.util.js', () => ({
        sendMail: jest.fn()
    }));
    let authService: AuthService;
    let userRepository: any;
    let authRequestRepository: any;
    let jwt: any;

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn()
        }
        authRequestRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        }
        jwt = {
            sign: jest.fn(),
        }
        authService = new AuthService(userRepository, authRequestRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('startAuthentication', () => {
        it('should start authentication successfully', async () => {
            // Mock the UserRepository's findByEmail method
            userRepository.findByEmail.mockResolvedValue(MockData.users[0]);

            // Mock the AuthRequestRepository's save method
            authRequestRepository.save.mockResolvedValue();


            const user = MockData.users[0]
            const result = await authService.startAuthentication(user);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
            expect(authRequestRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ auth_request_id: expect.any(String) });
        });

        it('should throw an AppError if the user does not exist', async () => {
            userRepository.findByEmail.mockResolvedValue(null);

            const user = { email: 'test@example.com', password: 'password' };

            await expect(authService.startAuthentication(user)).rejects.toThrow(
                new AppError({
                    description: 'Neplatné přihlašovací údaje',
                    name: 'AUTH_SERVICE',
                    httpCode: HttpCode.BAD_REQUEST,
                })
            );

            expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
            expect(authRequestRepository.save).not.toHaveBeenCalled();
        });

        // Add more test cases for different scenarios
    });

    describe('authenticate', () => {
        it('should authenticate successfully', async () => {
            process.env.SECRET_KEY = 'your_secret_key';

            const authRequest = {
                attempts_remaining: 3,
                auth_request_id: 'auth_request_id',
                email: 'test@example.com',
                code: 1234,
                expires_at: Date.now() + 60 * 5 * 1000,
            };

            const user = {
                email: 'test@example.com',
                name: 'Test User',
            };
            const mockedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNjg0MzYyMDExLCJleHAiOjE2ODQ1MzQ4MTF9.YV6PV1fJu-JydbxmhW9rEr3fmtlqjFluTexCm_Ghb1U"
            userRepository.findByEmail.mockResolvedValue(user);
            authRequestRepository.findById.mockResolvedValue(authRequest);
            authRequestRepository.remove.mockResolvedValue();
            jwt.sign.mockReturnValue(mockedToken);

            const data = { auth_request_id: 'auth_request_id', code: 1234 };
            const result = await authService.authenticate(data);

            expect(authRequestRepository.findById).toHaveBeenCalledWith(data.auth_request_id);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(authRequest.email);
            expect(authRequestRepository.remove).toHaveBeenCalledWith(data.auth_request_id);

            expect(result.user).toEqual({
                email: user.email, name: user.name
            });
        });

        it('should throw an AppError if the auth request does not exist', async () => {
            authRequestRepository.findById.mockResolvedValue(null);

            const data = { auth_request_id: 'non_existent_id', code: 1234 };

            await expect(authService.authenticate(data)).rejects.toThrow(
                new AppError({
                    description: 'Neplatný požadavek na přhilášení',
                    name: 'AUTH_SERVICE',
                    httpCode: HttpCode.BAD_REQUEST,
                })
            );

            expect(authRequestRepository.findById).toHaveBeenCalledWith(data.auth_request_id);
            expect(userRepository.findByEmail).not.toHaveBeenCalled();
            expect(authRequestRepository.remove).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should throw an AppError if the auth request has expired', async () => {
            const expiredAuthRequest = {
                attempts_remaining: 3,
                auth_request_id: 'expired_auth_request_id',
                email: 'test@example.com',
                code: 1234,
                expires_at: Date.now() - 60 * 5 * 1000, // Set expires_at in the past
            };

            authRequestRepository.findById.mockResolvedValue(expiredAuthRequest);

            const data = { auth_request_id: 'expired_auth_request_id', code: 1234 };

            await expect(authService.authenticate(data)).rejects.toThrow(
                new AppError({
                    description: 'Váš požadavek pro přihlášení je po expiraci',
                    name: 'AUTH_SERVICE',
                    httpCode: HttpCode.BAD_REQUEST,
                })
            );

            expect(authRequestRepository.findById).toHaveBeenCalledWith(data.auth_request_id);
            expect(userRepository.findByEmail).not.toHaveBeenCalled();
            expect(authRequestRepository.remove).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should throw an AppError if the code is invalid', async () => {
            const expires_at = Date.now() + 60 * 5 * 1000

            const authRequest = {
                attempts_remaining: 2,
                auth_request_id: 'auth_request_id',
                email: 'test@example.com',
                code: 1234,
                expires_at: expires_at
            };

            const user = {
                email: 'test@example.com',
                name: 'Test User',
            };

            userRepository.findByEmail.mockResolvedValue(user);
            authRequestRepository.findById.mockResolvedValue(authRequest);
            authRequestRepository.update.mockResolvedValue();

            const data = { auth_request_id: 'auth_request_id', code: 5678 };

            await expect(authService.authenticate(data)).rejects.toThrow(
                new AppError({
                    description: 'Zadali jste neplatný kód',
                    name: 'AUTH_SERVICE',
                    httpCode: HttpCode.BAD_REQUEST,
                })
            );

            expect(authRequestRepository.findById).toHaveBeenCalledWith(data.auth_request_id);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(authRequest.email);
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should throw an AppError if the number of attempts exceeded the limit', async () => {
            const authRequest = {
                attempts_remaining: 1,
                auth_request_id: 'auth_request_id',
                email: 'test@example.com',
                code: 1234,
                expires_at: Date.now() + 60 * 5 * 1000,
            };

            const user = {
                email: 'test@example.com',
                name: 'Test User',
            };

            userRepository.findByEmail.mockResolvedValue(user);
            authRequestRepository.findById.mockResolvedValue(authRequest);
            authRequestRepository.remove.mockResolvedValue();

            const data = { auth_request_id: 'auth_request_id', code: 5678 };

            await expect(authService.authenticate(data)).rejects.toThrow(
                new AppError({
                    description: 'Překročili jste počet pokusů, váš účet byl zablokován.',
                    name: 'AUTH_SERVICE',
                    httpCode: HttpCode.BAD_REQUEST,
                })
            );

            expect(authRequestRepository.findById).toHaveBeenCalledWith(data.auth_request_id);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(authRequest.email);
            expect(authRequestRepository.remove).toHaveBeenCalledWith(data.auth_request_id);
            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });

});
