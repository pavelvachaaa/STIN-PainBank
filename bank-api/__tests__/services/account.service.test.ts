import { Container } from 'typedi';
import UserRepository from '../../repositories/user.repository.js';
import AccountRepository from '../../repositories/account.repository.js';
import UserService from '../../services/user.service.js';
import CreateUserDto from '../../dtos/create_user.dto.js';
import { AppError } from '../../vendor/pavel_vacha/exceptions/AppError.js';
import { expect, jest, test } from '@jest/globals';
import hash from '../../vendor/pavel_vacha/utils/auth.util.js';
import AccountService from '../../services/account.service.js';
import CurrencyRepository from '../../repositories/currency.repository.js';
import PaymentRepository from '../../repositories/payment.repository.js';
import WithdrawDto from '../../dtos/withdraw_dto.js';
import MockData from '../../MockData.js';
import DepositDto from '../../dtos/deposit_dto.js';
import OpenAccountDTO from '../../dtos/open_account.dto.js';


describe('AccountService', () => {
    let accService: AccountService;
    let accountRepoMock: any;
    let paymentRepoMock: any;
    let currencyRepoMock: any;

    beforeEach(() => {
        // Create a mock instance of the currency repository
        accountRepoMock = {
            getUserAccounts: jest.fn(),
            withdraw: jest.fn(),
            deposit: jest.fn(),
            open: jest.fn()
        };

        paymentRepoMock = {
            save: jest.fn(),
        }

        currencyRepoMock = {
            getLast: jest.fn(),
            doesCurrencyExist: jest.fn()
        }


        // Register the mock instance with the typedi container
        Container.set(AccountRepository, accountRepoMock);
        Container.set(CurrencyRepository, currencyRepoMock);
        Container.set(PaymentRepository, paymentRepoMock);

        // Create an instance of the CurrencyService
        accService = new AccountService(Container.get(PaymentRepository), Container.get(AccountRepository), Container.get(CurrencyRepository));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should withdraw amount from the account', async () => {
        // Mock the accountRepo methods
        const withdrawMock = accountRepoMock.withdraw.mockResolvedValue();
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([

            {
                "account_id": "115-02812213/0100",
                "balance": 1000.00,
                "currency": "CZK"
            },
            {
                "account_id": "115-02812214/0100",
                "currency": "EUR",
                "balance": 10
            },
        ]);

        const dto: WithdrawDto = {
            email: 'pavel@tul.cz',
            currency: 'CZK',
            amount: 50
        };

        const res = await accService.withdraw(dto);

        expect(getUserAccountsMock).toHaveBeenCalledWith('pavel@tul.cz');
        expect(withdrawMock).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if the amount is greater than the account balance', async () => {
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([

            {
                "account_id": "115-02812213/0100",
                "balance": 1000.00,
                "currency": "CZK"
            },
            {
                "account_id": "115-02812214/0100",
                "currency": "EUR",
                "balance": 10
            },
        ]);

        const getLastCurrencyMock = currencyRepoMock.getLast.mockResolvedValue(MockData.currencies)

        const dto: WithdrawDto = {
            email: 'pavel@tul.cz',
            currency: 'EUR',
            amount: 150
        };

        await expect(accService.withdraw(dto)).rejects.toThrow(AppError);

        expect(getUserAccountsMock).toHaveBeenCalledWith('pavel@tul.cz');
    });

    it('should withdraw amount from the account if balance plus 10% is sufficient', async () => {
        const withdrawMock = accountRepoMock.withdraw.mockResolvedValue();
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([

            {
                "account_id": "115-02812213/0100",
                "balance": 1000.00,
                "currency": "CZK"
            },
            {
                "account_id": "115-02812214/0100",
                "currency": "EUR",
                "balance": 10
            },
        ]);

        const dto: WithdrawDto = {
            email: 'user@example.com',
            currency: 'CZK',
            amount: 1090
        };

        await accService.withdraw(dto);

        expect(getUserAccountsMock).toHaveBeenCalledWith('user@example.com');
        expect(withdrawMock).toHaveBeenCalledWith({ ...dto, amount: (1090 - (1000 - 1090) * 0.1) });
    });

    it('should throw an error if the user has no accounts', async () => {
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([]);
        const dto: WithdrawDto = {
            email: 'user@example.com',
            currency: 'USD',
            amount: 50
        };

        await expect(accService.withdraw(dto)).rejects.toThrow(AppError);

        expect(getUserAccountsMock).toHaveBeenCalledWith('user@example.com');
    });

    it('should throw an error if the amount is invalid', async () => {
        const dto: WithdrawDto = {
            email: 'user@example.com',
            currency: 'USD',
            amount: -50
        };

        await expect(accService.withdraw(dto)).rejects.toThrow(AppError);
    });




    it('should deposit amount into the account', async () => {
        // Mock the accountRepo methods
        const depositMock = accountRepoMock.deposit.mockResolvedValue();
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([
            { currency: 'USD', balance: 100 },
            { currency: 'EUR', balance: 200 }
        ]);

        const dto: DepositDto = {
            email: 'user@example.com',
            currency: 'USD',
            amount: 50
        };

        await accService.deposit(dto);

        expect(getUserAccountsMock).toHaveBeenCalledWith('user@example.com');
        expect(depositMock).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if the amount is invalid', async () => {
        const dto: DepositDto = {
            email: 'user@example.com',
            currency: 'USD',
            amount: -50
        };

        await expect(accService.deposit(dto)).rejects.toThrow(AppError);
    });


    it('should open a new account if the user does not have an account with the specified currency', async () => {
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([]);
        const getLastCurrencyMock = currencyRepoMock.getLast.mockResolvedValue(MockData.currencies)
        const doesCurrencyExistMock = currencyRepoMock.doesCurrencyExist.mockReturnValue(true);

        const openMock = accountRepoMock.open.mockResolvedValue({
          id: 'account-id',
          email: 'user@example.com',
          currency: 'USD',
          balance: 0
        });
    
        const dto: OpenAccountDTO = {
          email: 'user@example.com',
          currency: 'USD'
        };
    
        const result = await accService.open(dto);
    
        expect(getUserAccountsMock).toHaveBeenCalledWith('user@example.com');
        expect(openMock).toHaveBeenCalledWith(dto);
        expect(result).toEqual({
          id: 'account-id',
          email: 'user@example.com',
          currency: 'USD',
          balance: 0
        });
      });
    
      it('should throw an error if the user already has an account with the specified currency', async () => {
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([
          { currency: 'USD', balance: 0 }
        ]);
    
        const dto: OpenAccountDTO = {
          email: 'user@example.com',
          currency: 'USD'
        };
    
        await expect(accService.open(dto)).rejects.toThrow(AppError);
    
        expect(getUserAccountsMock).toHaveBeenCalledWith('user@example.com');
      });
    
      it('should throw an error if the specified currency is not supported', async () => {
        const getUserAccountsMock = accountRepoMock.getUserAccounts.mockResolvedValue([]);
        const doesCurrencyExistMock = currencyRepoMock.doesCurrencyExist.mockReturnValue(false);
    
        const dto: OpenAccountDTO = {
          email: 'user@example.com',
          currency: 'XYZ'
        };
    
        await expect(accService.open(dto)).rejects.toThrow(AppError);
    
        expect(getUserAccountsMock).toHaveBeenCalledWith('user@example.com');
        expect(doesCurrencyExistMock).toHaveBeenCalledWith('XYZ');
      });
    

});
