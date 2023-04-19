import IPayment from "../models/IPayment.js";

export default interface IPaymentRepository {
    save(payment: IPayment): any;
    getByEmail(email: string): IPayment[];
}