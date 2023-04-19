import { AppError, HttpCode } from "../../exceptions/AppError.js";

describe("AppError", () => {
    describe("constructor", () => {
        it("should create a new instance with default name and isOperational values", () => {
            const error = new AppError({ httpCode: HttpCode.BAD_REQUEST, description: "Test error" });

            expect(error).toBeDefined();
            expect(error.name).toBe("Error");
            expect(error.httpCode).toBe(HttpCode.BAD_REQUEST);
            expect(error.message).toBe("Test error");
            expect(error.isOperational).toBe(true);
        });

        it("should create a new instance with custom name and isOperational values", () => {
            const error = new AppError({
                name: "CustomError",
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Test error",
                isOperational: false,
            });

            expect(error).toBeDefined();
            expect(error.name).toBe("CustomError");
            expect(error.httpCode).toBe(HttpCode.INTERNAL_SERVER_ERROR);
            expect(error.message).toBe("Test error");
            expect(error.isOperational).toBe(false);
        });


        it('should be able to create an operational error', () => {
            const error = new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: 'Invalid request payload',
            });

            expect(error.name).toEqual('Error');
            expect(error.message).toEqual('Invalid request payload');
            expect(error.httpCode).toEqual(HttpCode.BAD_REQUEST);
            expect(error.isOperational).toEqual(true);
        });

        it('should be able to create a non-operational error', () => {
            const error = new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: 'Unexpected server error',
                isOperational: false,
            });

            expect(error.name).toEqual('Error');
            expect(error.message).toEqual('Unexpected server error');
            expect(error.httpCode).toEqual(HttpCode.INTERNAL_SERVER_ERROR);
            expect(error.isOperational).toEqual(false);
        });

        it('should capture the stack trace', () => {
            const error = new AppError({
                httpCode: HttpCode.NOT_FOUND,
                description: 'Resource not found',
            });

            expect(error.stack).not.toBeNull();
        });

        it('should use the provided error name', () => {
            const error = new AppError({
                name: 'CustomError',
                httpCode: HttpCode.BAD_REQUEST,
                description: 'Invalid request payload',
            });

            expect(error.name).toEqual('CustomError');
        });
    });


});
