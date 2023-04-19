export default interface IPayment {
    type: "IN" | "OUT";
    email: string;
    currency: string;
    amount: number;
    timestamp: number

}