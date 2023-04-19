import MockData from "../../data/MockData";
import IPayment from "../../models/IPayment";
import PaymentRepository from "../../repositories/payment.repository";
import Database from "../../vendor/pavel_vacha/core/database";


/// TODO: Přidat ještě default users
/// TODO: Vytvořit nějaky mock data a ty všude před každým testem použít
describe('PaymentRepository', () => {
    let repository: PaymentRepository;
    let database: Database;

    const defaultRequests: IPayment[] = MockData.payments;

    beforeAll(async () => {
        database = new Database("", true);
        await database.createConnection()

        repository = new PaymentRepository(database);
        await database.set("payments", MockData.payments)

    });

    describe("save", () => {
        it("should save a payment to the database", async () => {
            const payment: IPayment = { "amount": 5, "currency": "USD", "timestamp": 0, "email": "pepa@new.cz", "type": "IN" }
            await repository.save(payment);
            const userPayments = repository.getByEmail('pepa@new.cz');

            expect(userPayments).toContainEqual(payment);
        });


    });

    describe('getByEmail', () => {

        it('should return all payments with the given user_id', async () => {
            const payments: IPayment[] = [{ "amount": 100, "currency": "CZK", "timestamp": 1681743585915, "email": "new@new.cz", "type": "IN" }, { "amount": 100, "currency": "CZK", "timestamp": 1681743585915, "email": "notme@tul.cz", "type": "IN" }, { "amount": 100, "currency": "CZK", "timestamp": 1681743585915, "email": "new@new.cz", "type": "IN" }, { "amount": 100, "currency": "CZK", "timestamp": 1681743585915, "email": "new@new.cz", "type": "IN" },];
            await database.push("payments", payments)

            const userPayments = repository.getByEmail('new@new.cz');

            expect(userPayments).toHaveLength(payments.length - 1);
            expect(userPayments).toContainEqual(payments[0]);
        });

        it('should return an empty array if no payments match the user_id', () => {
            const userPayments = repository.getByEmail('TOHOHLE_TADY_NENAJDES');

            expect(userPayments).toHaveLength(0);
        });

    });

});