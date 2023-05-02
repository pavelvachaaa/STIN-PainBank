import ICurrency from "../models/ICurrency.js";
<<<<<<< HEAD
import IExchangeRate from "../models/IExchangeRate.js";

export default interface ICurrencyRepository {
    save(exchangeRate: IExchangeRate): Promise<void>;
    getLast(): Promise<ICurrency[]>
=======

export default interface ICurrencyRepository {
    save(): any;
    getLast(): ICurrency[]
>>>>>>> main
    getRate(currency: string): number;
    doesCurrencyExist(currency: string): boolean;
}