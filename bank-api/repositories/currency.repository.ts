import { Service } from "typedi";
import ICurrencyRepository from "../interfaces/CurrencyRepository.interface.js";
import ICurrency from "../models/ICurrency.js";
import { DatabaseService } from "../services/database.service.js";
<<<<<<< HEAD
import { saveFile, readFile } from "../utils/file.util.js";
import CurrencyStorage from "../utils/currency.storage.js";
import IExchangeRate from "../models/IExchangeRate.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
=======
>>>>>>> main

@Service()
export class CurrencyRepository implements ICurrencyRepository {

<<<<<<< HEAD
    constructor(private db: DatabaseService, private currencyStorage: CurrencyStorage) {
    }

    public async save(exchangeRate: IExchangeRate): Promise<void> {
        await this.db.push("currencies", [exchangeRate]);
    }


    public async getLast(): Promise<ICurrency[]> {
        const exchangeRate = this.db.chain.get("currencies", [])?.last()?.value()
        const data = exchangeRate?.data

        if (data && this.isCurrent(exchangeRate)) {
            return data;
        } else {
            const newExchangeRate = await this.currencyStorage.getLast();
            await this.save(newExchangeRate);
            await this.db.write();
            return newExchangeRate.data;
        }

    }

    private isCurrent(exchangeRate: IExchangeRate): boolean {
        const exchangeRateDate: Date = new Date(exchangeRate.fetched_at)

        return true
    }

    public doesCurrencyExist(currency: string): boolean {
        return this.db.chain.get("currencies", [])?.last()?.value()?.data?.findIndex(curr => curr.name === currency) > -1
=======
    constructor(private db: DatabaseService) {
    }

    public save() {
        throw new Error("Method not implemented.");
    }

    public getLast(): ICurrency[] {
        return this.db.chain.get("currencies", []).last().value().data;
    }

    public doesCurrencyExist(currency: string): boolean {
        return this.db.chain.get("currencies", []).last().value().data.findIndex(curr => curr.name === currency) > -1
>>>>>>> main
    }

    public getRate(currency: string): number {
        throw new Error("Method not implemented.");
    }

}
export default CurrencyRepository;