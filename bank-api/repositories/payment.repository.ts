import { Service } from "typedi";
import IPaymentRepository from "../interfaces/PaymentRepository.interface.js";
import IPayment from "../models/IPayment.js";
import { DatabaseService } from "../services/database.service.js";

@Service()
export class PaymentRepository implements IPaymentRepository {
    constructor(private db: DatabaseService) {
    }

    async save(payment: IPayment) {
        await this.db.push("payments", [payment]);
    }

    getByEmail(email: string): IPayment[] {
        return this.db.chain.get("payments", []).filter({ email: email }).reverse().value();
    }

}
export default PaymentRepository;