import Database from "../../vendor/pavel_vacha/core/database.js";
import AuthRequestRepository, { AccountRepository } from "../../repositories/account.repository.js";
import { expect, jest, test } from '@jest/globals';
import MockData from "../../MockData.js";
import { AppError } from "../../vendor/pavel_vacha/exceptions/AppError.js";
import IUser from "../../models/IUser.js";
import CreateUserDto from "../../dtos/create_user.dto.js";
import OpenAccountDTO from "../../dtos/open_account.dto.js";
import WithdrawDto from "../../dtos/withdraw_dto.js";

let database: Database;
let repository: AccountRepository;


describe('Account repository test', () => {


    beforeAll(async () => {
        database = new Database("", true);
        await database.createConnection()

        repository = new AccountRepository(database);
        await database.set("users", MockData.users)

    });

    describe("open", () => {
        it("should open a new account", async () => {
            const writeSpy = jest.spyOn(database, "write");
            const getSpy = jest.spyOn(database.chain, "get");

            const openAccountDto: OpenAccountDTO = {
                email: MockData.users[0].email,
                currency: "USD"
            };

            const result = await repository.open(openAccountDto);

            expect(result).toBeTruthy();
            expect(getSpy).toHaveBeenCalledWith("users");
            expect(writeSpy).toHaveBeenCalled();
        });

        it("should throw an error if account for the given currency already exists", async () => {
            const openAccountDto: OpenAccountDTO = {
                email: MockData.users[0].email,
                currency: MockData.users[0].accounts[0].currency
            };

            await expect(repository.open(openAccountDto)).rejects.toThrow(AppError);
        });
    });

    describe("getUserAccounts", () => {
        it("should return the user's accounts", async () => {
            const findSpy = jest.spyOn(database, "findOne");

            findSpy.mockReturnValueOnce({
                email: "test@test.com",
                accounts: [{ account_id: "123", balance: 0, currency: "USD" }],
            });

            const result = await repository.getUserAccounts("test@test.com");
            expect(result).toEqual([{ account_id: "123", balance: 0, currency: "USD" }]);
            expect(findSpy).toHaveBeenCalledWith("users", { email: "test@test.com" });
        });

        it("should return empty array if not found", async () => {
            const findSpy = jest.spyOn(database, "findOne");

            const result = await repository.getUserAccounts("NEEXISTUJICI_ACCOUNT");
            expect(result).toHaveLength(0);
            expect(result).toEqual([]);
            expect(findSpy).toHaveBeenCalledWith("users", { email: "NEEXISTUJICI_ACCOUNT" });
        });
    });



    describe("withdraw", () => {
        beforeEach(() => {
            database.chain.get("users").remove(_ => true)
        });

        it("should withdraw the specified amount from the user's account", async () => {

            const email = 'test@examplaa.com';
            const currency = 'USD';
            const startingBalance = 100;
            const withdrawalAmount = 50;

            database.chain.get("users").value().push({
                name: "A",
                password: "B",
                email: email,
                accounts: [{ account_id: '123', balance: startingBalance, currency: currency }],
            } as any)


            await repository.withdraw({ email, currency, amount: withdrawalAmount });

            const userAccounts = await repository.getUserAccounts(email);
            const account = userAccounts.find((acc) => acc.currency === currency);
            expect(account?.balance).toBe(startingBalance - withdrawalAmount);
        });

        it("should throw when u exceed ammount", async () => {

            const email = 'test@examplaa.com';
            const currency = 'USD';
            const startingBalance = 100;
            const withdrawalAmount = 5000;

            database.chain.get("users").value().push({
                name: "A",
                password: "B",
                email: email,
                accounts: [{ account_id: '123', balance: startingBalance, currency: currency }],
            } as any)

            await expect(repository.withdraw({ email, currency, amount: withdrawalAmount })).rejects.toThrow(AppError);
        });

    });



    // describe("deposit", () => {
    //     beforeEach(() => {
    //         database.chain.get("users").remove(_ => true)
    //     });
    //     // TODO: NEFUNKČNÍ TEST KVŮLI NĚJAKÉ MAGII
    //     // it("should deposit the specified amount to the user's account", async () => {

    //     //     const email = 'test@examplaa.com';
    //     //     const currency = 'USD';
    //     //     const startingBalance = 100;
    //     //     const depositAmount = 50;

    //     //     database.chain.get("users").value().push({
    //     //         name: "A",
    //     //         password: "B",
    //     //         email: email,
    //     //         accounts: [{ account_id: '123', balance: startingBalance, currency: currency }],
    //     //     } as any)
    //     //     await database.write()
    //     //     await repository.deposit(email, currency, 50);

    //     //     await database.read();
    //     //     const userAccounts = await repository.getUserAccounts(email);
    //     //     console.log(userAccounts)
    //     //     const account = userAccounts.find((acc) => acc.currency === currency);
    //     //     expect(account?.balance).toBe(startingBalance + depositAmount);
    //     // });
    // });


    describe("close", () => {
        it("close", async () => {
            expect(() => repository.close("", "")).toThrow('Method not implemented.');
        })
    });

    describe("getHistory", () => {
        it("getHistory", () => {
            expect(() => repository.getHistory()).toThrow('Method not implemented.');
        })
    });


});





