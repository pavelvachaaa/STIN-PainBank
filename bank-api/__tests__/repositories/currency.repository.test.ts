import MockData from "../../MockData.js";
import IExchangeRate from "../../models/IExchangeRate.js";
import CurrencyRepository from "../../repositories/currency.repository.js";
import { expect, jest, test } from '@jest/globals';

describe('CurrencyRepository', () => {
    let currencyRepository: CurrencyRepository;
    let mockDb: any;
    let mockCurrencyStorage: any;

    beforeEach(() => {
        // Create mock instances of DatabaseService and CurrencyStorage
        mockDb = {
            push: jest.fn(),
            chain: {
                get: jest.fn(),
            },
            write: jest.fn(),
        } as unknown as any;

        mockCurrencyStorage = {
            getLast: jest.fn(),
        } as any;

        // Create an instance of CurrencyRepository
        currencyRepository = new CurrencyRepository(mockDb, mockCurrencyStorage);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save exchange rate to the database', async () => {
        const exchangeRate: IExchangeRate = {
            fetched_at: Date.now(),
            data: [
                { country: 'UK', full_name: 'British Pound', amount: 1, name: 'GBP', rate: 0.7 },
                { country: 'EU', full_name: 'Euro', amount: 1, name: 'EUR', rate: 0.8 },
            ],
        };


        await currencyRepository.save(exchangeRate);

        expect(mockDb.push).toHaveBeenCalledTimes(1);
        expect(mockDb.push).toHaveBeenCalledWith('currencies', [exchangeRate]);
    });

    it('should return false if currency does not exist', () => {
        const currency = 'USD';

        // Mock the behavior of the get method in mockDb
        mockDb.chain.get.mockReturnValueOnce({
            last: jest.fn().mockReturnValueOnce({
                value: jest.fn().mockReturnValueOnce({
                    data: [
                        { name: 'EUR', /* other properties */ },
                    ],
                }),
            }),
        });

        const result = currencyRepository.doesCurrencyExist(currency);

        expect(result).toBe(false);
        expect(mockDb.chain.get).toHaveBeenCalledWith('currencies', []);
    });



    it('should return true if currency exist', () => {
        const currency = 'USD';

        // Mock the behavior of the get method in mockDb
        mockDb.chain.get.mockReturnValueOnce({
            last: jest.fn().mockReturnValueOnce({
                value: jest.fn().mockReturnValueOnce({
                    data: [
                        { name: 'USD', /* other properties */ },
                    ],
                }),
            }),
        });

        const result = currencyRepository.doesCurrencyExist(currency);

        expect(result).toBe(true);
        expect(mockDb.chain.get).toHaveBeenCalledWith('currencies', []);
    });


    it('should return the current data if it exists and is current', async () => {
        const exchangeRate = {
            data: []
        };

        // Mock the behavior of the get method in mockDb
        mockDb.chain.get.mockReturnValueOnce({
            last: jest.fn().mockReturnValueOnce({
                value: jest.fn().mockReturnValueOnce(exchangeRate),
            }),
        });

        const result = await currencyRepository.getLast();

        expect(result).toEqual(exchangeRate.data);
        expect(mockDb.chain.get).toHaveBeenCalledWith('currencies', []);
    });

    it('should retrieve new data if current data is not found or not current', async () => {
        const exchangeRate = {
            data: MockData.currencies

        };

        // Mock the behavior of the get method in mockDb
        mockDb.chain.get.mockReturnValueOnce({
            last: jest.fn().mockReturnValueOnce({
                value: jest.fn().mockReturnValueOnce(null),
            }),
        });

        // Mock the behavior of getLast method in mockCurrencyStorage
        mockCurrencyStorage.getLast.mockResolvedValueOnce(exchangeRate);

        const result = await currencyRepository.getLast();

        expect(result).toEqual(exchangeRate.data);
        expect(mockDb.chain.get).toHaveBeenCalledWith('currencies', []);
        expect(mockCurrencyStorage.getLast).toHaveBeenCalledTimes(1);
        expect(mockDb.write).toHaveBeenCalledTimes(1);
        expect(mockDb.push).toHaveBeenCalledTimes(1);
    });

});
