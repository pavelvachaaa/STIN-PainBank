import { Service } from "typedi";
import ICurrencyRepository from "../interfaces/CurrencyRepository.interface.js";
import ICurrency from "../models/ICurrency.js";
import { DatabaseService } from "../services/database.service.js";
import CurrencyStorage from "../utils/currency.storage.js";
import IExchangeRate from "../models/IExchangeRate.js";

@Service()
export class CurrencyRepository implements ICurrencyRepository {

    constructor(private db: DatabaseService, private currencyStorage: CurrencyStorage) {
    }

    public async save(exchangeRate: IExchangeRate): Promise<void> {
        await this.db.push("currencies", [exchangeRate]);
    }


    public async getLast(): Promise<ICurrency[]> {
        const exchangeRate = this.db.chain.get("currencies", [])?.last()?.value()
        const data = exchangeRate?.data

        if (data && this.isCurrent(exchangeRate)) {
            console.log("Is current")
            return data;
        } else {
            const newExchangeRate = await this.currencyStorage.getLast();
            await this.save(newExchangeRate);
            await this.db.write();
            return newExchangeRate?.data ?? [];
        }

    }

    public isCurrent(exchangeRate: IExchangeRate): boolean {
        const exchangeRateDateTime: number = exchangeRate.fetched_at
        const refDate = new Date();
        refDate.setHours(14, 30, 0, 0)

        const refDateNight = new Date();
        refDateNight.setHours(0, 0, 0, 0)

        return exchangeRateDateTime >= refDate.valueOf() || (exchangeRateDateTime >= refDateNight.valueOf() && exchangeRateDateTime <= refDate.valueOf() && new Date().valueOf() < refDate.valueOf());
    }

    public doesCurrencyExist(currency: string): boolean {
        return this.db.chain.get("currencies", [])?.last()?.value()?.data?.findIndex(curr => curr.name === currency) > -1
    }

}
export default CurrencyRepository;