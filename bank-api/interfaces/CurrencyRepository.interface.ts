import ICurrency from "../models/ICurrency.js";
import IExchangeRate from "../models/IExchangeRate.js";

export default interface ICurrencyRepository {
    save(exchangeRate: IExchangeRate): Promise<void>;
    getLast(): Promise<ICurrency[]>
    getRate(currency: string): number;
    doesCurrencyExist(currency: string): boolean;
}