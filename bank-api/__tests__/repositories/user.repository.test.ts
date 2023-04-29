import Database from "../../vendor/pavel_vacha/core/database.js";
import AuthRequestRepository, { UserRepository } from "../../repositories/user.repository.js";
import { expect, jest, test } from '@jest/globals';
import MockData from "../../MockData.js";
import { AppError } from "../../vendor/pavel_vacha/exceptions/AppError.js";
import CreateUserDto from "../../dtos/create_user.dto.js";

let database: Database;
let repository: UserRepository;


describe('User repository test', () => {


    beforeAll(async () => {
        database = new Database("", true);
        await database.createConnection()

        repository = new UserRepository(database);
        await database.set("users", MockData.users)

    });
    // Test the findByEmail method
    describe('findByEmail', () => {

        it('should call db.findOne with the correct arguments', () => {
            const findByEmailSpy = jest.spyOn(database, "findOne");
            const user = repository.findByEmail(MockData.users[0].email);
            expect(findByEmailSpy).toHaveBeenCalledWith('users', { email: MockData.users[0].email });
        });

        it('should return correct user ', () => {
            const findByEmailSpy = jest.spyOn(database, "findOne");
            const user = repository.findByEmail(MockData.users[0].email);
            // console.log(user)
            expect(findByEmailSpy).toHaveBeenCalledWith('users', { email: MockData.users[0].email });
            expect(user).toEqual(MockData.users[0]);
        });

    });



    describe("save", () => {
        it('should throw an error if a user with the same email already exists', async () => {
            await expect(repository.save(MockData.users[0])).rejects.toThrow(AppError)
        });

        it('should save a new user and return it', async () => {
            const chainEmail = jest.spyOn(database.chain, "get");

            const user: CreateUserDto = { email: "novy_neexistujiciEmail@ahoj.cz", name: "Test", password: "test" }
            const savedUser = await repository.save(user);

            const dbUser = repository.findByEmail(savedUser.email);

            expect(dbUser.accounts).toEqual([]);
            expect(dbUser).toEqual({ ...savedUser, accounts: [] })
        });

    });

    afterAll(async () => {
        // Nějak to ukončit - asi vyčistit a smazat.

    });

});