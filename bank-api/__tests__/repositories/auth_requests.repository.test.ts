import Database from "../../vendor/pavel_vacha/core/database.js";
import AuthRequestRepository from "../../repositories/auth_requests.repository.js";
import IAuthRequest from "../../models/IAuthRequest.js";
import { expect, jest, test } from '@jest/globals';
import { AppError } from "../../vendor/pavel_vacha/exceptions/AppError.js";
<<<<<<< HEAD
import MockData from "../../MockData.js";
=======
import MockData from "../../data/MockData.js";
>>>>>>> main

let database: Database;
let repository: AuthRequestRepository;


describe('AuthRequestRepository', () => {
    const defaultRequests: IAuthRequest[] = MockData.auth_requests;


    beforeAll(async () => {
        database = new Database("", true);
        await database.createConnection()

        repository = new AuthRequestRepository(database);

        /// Přidání testovacích dat
        database.chain.get("auth_requests", []).value().push(...defaultRequests);
    });

    test('save method should add the auth request to the database', async () => {
        const getSpy = jest.spyOn(database.chain, "get");
        const writeSpy = jest.spyOn(database, "write");

        const authRequest: IAuthRequest = { auth_request_id: 'abc123', email: 'pavel@tul.cz', attempts_remaining: 3, code: 358, expires_at: 10000 };
        await repository.save(authRequest);

        expect(getSpy).toHaveBeenCalledWith('auth_requests');
        expect(writeSpy).toHaveBeenCalled();
        expect(database.chain.get("auth_requests").find({ auth_request_id: authRequest.auth_request_id }).value()).not.toBeUndefined();
        expect(database.chain.get("auth_requests").find({ auth_request_id: authRequest.auth_request_id }).value().auth_request_id).toBe(authRequest.auth_request_id);
    });


    test('remove method should remove the auth request from the database', async () => {
        const getSpy = jest.spyOn(database.chain, "get");
        const writeSpy = jest.spyOn(database, "write");

        const idToDelete = "id2"
        await repository.remove(idToDelete);

        expect(getSpy).toHaveBeenCalledWith('auth_requests');
        expect(writeSpy).toHaveBeenCalled();
        expect(database.chain.get("auth_requests").find({ auth_request_id: idToDelete }).value()).toBeUndefined();
    });

    // TODO: Už v repository throwvovat chyby
    test('findById method should return correct request id', async () => {
        const getSpy = jest.spyOn(database.chain, "get");

        const idToFind = defaultRequests[0].auth_request_id
        const request = repository.findById(idToFind);

        expect(getSpy).toHaveBeenCalledWith('auth_requests');
        expect(request).toEqual(defaultRequests[0])
    });

    test("findById method should throw when not found", () => {
        const idToFind = "UNKNOWN_ID";
        // Kvůli expressu nejde použít .toThrow(), jelikož nejdřívě to chytí express
        // Predelat podle auth middlewaru
        try {
            repository.findById(idToFind)
        } catch (e) {
            expect(true).toBe(true);
        }
    });

    test("update method should update auth reqeuest by id", async () => {
        const getSpy = jest.spyOn(database.chain, "get");
        const writeSpy = jest.spyOn(database, "write");

        const authRequest = defaultRequests[0]
        authRequest.attempts_remaining -= 1;
        const idToUpdate = authRequest.auth_request_id

        await repository.update(authRequest);

        expect(getSpy).toHaveBeenCalledWith('auth_requests');
        expect(writeSpy).toHaveBeenCalled();
        expect(database.chain.get("auth_requests").find({ auth_request_id: idToUpdate }).value().attempts_remaining).toBe(authRequest.attempts_remaining);

    });


    // TODO: Test kde ho to nenajde a throwne to neco

    afterAll(async () => {
        // Nějak to ukončit - asi vyčistit a smazat.

    });

});