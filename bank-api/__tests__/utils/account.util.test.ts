import ICurrency from "../../models/ICurrency.js";
import generateAccountNumber, { exchangeMoney } from "../../utils/account.util.js";
import MockData from "../../MockData.js";
describe("Account util tests", () => {

    describe('generateAccountNumber', () => {
        test('should return a string', () => {
            expect(typeof generateAccountNumber()).toBe('string');
        });

        test('should have a length of 16', () => {
            expect(generateAccountNumber().length).toBe(16);
        });

        test('should only contain digits', () => {
            const accountNumber = generateAccountNumber();
            const regex = /^[0-9]+$/;
            expect(regex.test(accountNumber)).toBe(true);
        });

        test('should generate a valid account number', () => {
            const accountNumber = generateAccountNumber();
            expect(accountNumber.length).toBe(16); // The account number should be 16 characters long.
            expect(accountNumber.match(/^\d+$/)).not.toBeNull(); // The account number should contain only digits.
        });

        test('should generate different account numbers', () => {
            const accountNumber1 = generateAccountNumber();
            const accountNumber2 = generateAccountNumber();
            expect(accountNumber1).not.toBe(accountNumber2);
        });
    });
    describe('exchangeMoney', () => {
        const data: ICurrency[] = MockData.currencies;
        test('should convert from CZK to USD', () => {
            expect(exchangeMoney('CZK', 'USD', 1000, data)).toBeCloseTo(49.02);
        });

        test('should convert from USD to CZK', () => {
            expect(exchangeMoney('USD', 'CZK', 100, data)).toBeCloseTo(2040);
        });

        test('should throw error for unsupported currency', () => {
            expect(() => exchangeMoney('CZK', 'JPYYY', 1000, data)).toThrow('Unsupported currency');
        });

        test('should handle base currency with rate of 1', () => {
            expect(exchangeMoney('CZK', 'USD', 100, data)).toBeCloseTo(4.9);
        });

        test('should handle target currency with rate of 1', () => {
            expect(exchangeMoney('USD', 'CZK', 20.40, data)).toBeCloseTo(416.16);
        });

        test('should handle large amounts', () => {
            expect(exchangeMoney('EUR', 'GBP', 1000000, data)).toBeCloseTo(896428.57);
        });

        test('should handle small amounts', () => {
            expect(exchangeMoney('GBP', 'EUR', 0.01, data)).toBeCloseTo(0.0125);
        });
    });

})

