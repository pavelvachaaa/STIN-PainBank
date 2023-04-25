export interface IUser {
    email: string;
    role: string;
    jwt: string;
}

export interface IApiResponse {
    errors?: any[];
    responseCode?: HttpCode;
    message: string;
    data?: unknown;
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