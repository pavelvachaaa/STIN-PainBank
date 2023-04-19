import ICurrency from "./ICurrency.js";

export default interface IExchangeRate {
    fetched_at: number;
    data: ICurrency[]
}