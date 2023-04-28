export interface IUser {
    email: string;
    role: string;
    jwt: string;
}

export default interface IPayment {
    type: "IN" | "OUT";
    email: string;
    currency: string;
    amount: number;
    timestamp: number
}

export interface ICurrency {
    country: string;
    full_name: string;
    amount: number;
    name: string;
    rate: number
}
export interface IAccount {
    account_id: string;
    currency: string;
    balance: number;
}


export interface IApiResponse {
    errors?: any[];
    responseCode?: HttpCode;
    message: string;
    data?: any;
}

export enum HttpCode {
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}