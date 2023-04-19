import ICurrency from "../models/ICurrency.js";

export default interface ICurrencyRepository {
    save(): any;
    getLast(): ICurrency[]
    getRate(currency: string): number;
    doesCurrencyExist(currency: string): boolean;
}