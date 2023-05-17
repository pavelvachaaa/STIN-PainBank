import { Container } from 'typedi';
import UserRepository from '../../repositories/user.repository.js';
import AccountRepository from '../../repositories/account.repository.js';
import UserService from '../../services/user.service.js';
import CreateUserDto from '../../dtos/create_user.dto.js';
import { AppError } from '../../vendor/pavel_vacha/exceptions/AppError.js';
import { expect, jest, test } from '@jest/globals';
import hash from '../../vendor/pavel_vacha/utils/auth.util.js';


describe('UserService', () => {
    let userService: UserService;
    let userRepoMock: any;
    let accountRepoMock: any;

    beforeEach(() => {
        // Create a mock instance of the currency repository
        userRepoMock = {
            getLast: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
        };
        accountRepoMock = {
            open: jest.fn(),
        };

        // Register the mock instance with the typedi container
        Container.set(UserRepository, userRepoMock);
        Container.set(AccountRepository, accountRepoMock);

        // Create an instance of the CurrencyService
        userService = new UserService(Container.get(UserRepository), Container.get(AccountRepository));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a user successfully', async () => {
        const createUserDto: CreateUserDto = {
            name: "Pavel Vácha",
            email: 'test@example.com',
            password: 'password',
        };

        userRepoMock.findByEmail.mockResolvedValue(null);
        userRepoMock.save.mockResolvedValue({ ...createUserDto, "password":hash(createUserDto.password) });
        accountRepoMock.open.mockResolvedValue(true);

        const result = await userService.register(createUserDto);

        expect(userRepoMock.findByEmail).toHaveBeenCalledTimes(1);
        expect(userRepoMock.save).toHaveBeenCalledTimes(1);
        expect(accountRepoMock.open).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ ...createUserDto });
    });

    it('should throw an error if the user already exists', async () => {
        const createUserDto: CreateUserDto = {
            name: "Pavel Vácha",
            email: 'test@example.com',
            password: 'password',
        };

        userRepoMock.findByEmail.mockResolvedValue({ id: '1', ...createUserDto });

        await expect(userService.register(createUserDto)).rejects.toThrowError(AppError);

        expect(userRepoMock.findByEmail).toHaveBeenCalledTimes(1);
        expect(userRepoMock.save).not.toHaveBeenCalled();
        expect(accountRepoMock.open).not.toHaveBeenCalled();
    });

    it('should throw an error if opening an account fails', async () => {
        const createUserDto: CreateUserDto = {
            name: "Pavel Vácha",
            email: 'test@example.com',
            password: 'password',
        };

        userRepoMock.findByEmail.mockResolvedValue(null);
        userRepoMock.save.mockResolvedValue({ id: '1', ...createUserDto });
        accountRepoMock.open.mockResolvedValue(false);

        await expect(userService.register(createUserDto)).rejects.toThrowError(AppError);

        expect(userRepoMock.findByEmail).toHaveBeenCalledTimes(1);
        expect(userRepoMock.save).toHaveBeenCalledTimes(1);
        expect(accountRepoMock.open).toHaveBeenCalledTimes(1);
    });
});
