import { Container } from 'typedi';
import CurrencyService from '../../services/currency.service.js';
import CurrencyRepository from '../../repositories/currency.repository.js';
import { expect, jest, test } from '@jest/globals';
import MockData from '../../MockData.js';

describe('CurrencyService', () => {
    let currencyService: CurrencyService;
    let currencyRepoMock: any;

    beforeEach(() => {
        // Create a mock instance of the currency repository
        currencyRepoMock = {
            getLast: jest.fn(),
            isCurrent: jest.fn()

        };

        // Register the mock instance with the typedi container
        Container.set(CurrencyRepository, currencyRepoMock);

        // Create an instance of the CurrencyService
        currencyService = new CurrencyService(Container.get(CurrencyRepository));
    });

    it('should handle errors when retrieving the last list from the currency repository', async () => {
        const error = new Error('Failed to retrieve last list');
        currencyRepoMock.getLast.mockRejectedValue(error);
        currencyRepoMock.isCurrent.mockResolvedValue(true);

        await expect(currencyService.getLastList()).rejects.toThrowError(error);
        expect(currencyRepoMock.getLast).toHaveBeenCalledTimes(1);
    });

    it('should handle an empty list returned from the currency repository', async () => {
        const emptyList: string[] = [];
        currencyRepoMock.getLast.mockResolvedValue(emptyList);
        currencyRepoMock.isCurrent.mockResolvedValue(true);

        const result = await currencyService.getLastList();

        expect(currencyRepoMock.getLast).toHaveBeenCalledTimes(1);
        expect(result).toEqual(emptyList);
    });

    it('should get the last list from the currency repository', async () => {
        // Mock the desired behavior of the currency repository's getLast method
        const lastList = MockData.currencies
        currencyRepoMock.getLast.mockResolvedValue(lastList);
        currencyRepoMock.isCurrent.mockResolvedValue(true);

        // Call the getLastList method of the CurrencyService
        const result = await currencyService.getLastList();

        // Assert that the currency repository's getLast method was called
        expect(currencyRepoMock.getLast).toHaveBeenCalledTimes(1);

        // Assert the result returned by the CurrencyService
        expect(result).toEqual(lastList);
    });
});
