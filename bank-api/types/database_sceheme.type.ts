import IAuthRequest from "../models/IAuthRequest.js";
import ICurrency from "../models/ICurrency.js";
import IExchangeRate from "../models/IExchangeRate.js";
import IPayment from "../models/IPayment.js";
import IUser from "../models/IUser.js";

type DatabaseScheme = {
    payments: IPayment[];
    auth_requests: IAuthRequest[];
    users: IUser[];
    currencies: IExchangeRate[];
}

export default DatabaseScheme;