import CurrencyStorage, { CurrencyParser } from "../../utils/currency.storage.js";
import { expect, jest, test } from '@jest/globals';


jest.mock('../../utils/file.util.js', () => ({
    __esModule: true,
    mkdir: jest.fn<any>().mockResolvedValue(true),
    getMostRecentFile: jest.fn<any>().mockResolvedValue({ latestPath: '/path/to/latest', date: new Date() }),
    readFile: jest.fn<any>().mockResolvedValue('mocked file data'),
    saveFile: jest.fn<any>().mockResolvedValue(true),
}));

describe('CurrencyStorage', () => {
    let currencyStorage: CurrencyStorage;
    let currencyParserMock: any;
    beforeEach(() => {
        currencyParserMock = {
            parse: jest.fn(),
        };
        jest.clearAllMocks();
        currencyStorage = new CurrencyStorage(currencyParserMock);
    });

    describe('getLast', () => {
        it('should fetch, parse, and store data when no valid cache is available', async () => {
            const mockData = 'mocked currency data';
            const mockParsedData = {
                fetched_at: expect.any(Number),
                data: [
                    {
                        country: 'Mocked Country',
                        full_name: 'Mocked Currency',
                        amount: 1,
                        name: 'MCK',
                        rate: 1.0,
                    },
                ],
            };

            currencyStorage.fetchCurrencies = jest.fn<any>().mockResolvedValue(mockData);
            currencyParserMock.parse.mockReturnValue(mockParsedData);
            currencyStorage.store = jest.fn<any>();

            const result = await currencyStorage.getLast();

            expect(currencyStorage.fetchCurrencies).toHaveBeenCalledTimes(1);
            expect(currencyStorage.currencyParser.parse).toHaveBeenCalledWith(mockData.trim());
            expect(currencyStorage.store).toHaveBeenCalledWith(mockData);
            expect(result).toEqual(mockParsedData);
        });
    });
});
