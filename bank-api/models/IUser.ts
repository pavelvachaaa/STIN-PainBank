import IAccount from "./IAccount.js";

export default interface IUser {
    name: string;
    email: string;
    password: string;
    accounts: IAccount[];
};

