import { Service } from "typedi";
import ICurrencyRepository from "../interfaces/CurrencyRepository.interface.js";
import ICurrency from "../models/ICurrency.js";
import { DatabaseService } from "../services/database.service.js";
import { saveFile, readFile } from "../utils/file.util.js";
import CurrencyStorage from "../utils/currency.storage.js";
import IExchangeRate from "../models/IExchangeRate.js";

@Service()
export class CurrencyRepository implements ICurrencyRepository {

    constructor(private db: DatabaseService, private currencyStorage: CurrencyStorage) {
    }

    public save() {
        throw new Error("Method not implemented.");
    }


    public async getLast(): Promise<ICurrency[]> {
        const exchangeRate = this.db.chain.get("currencies", [])?.last()?.value()
        const data = exchangeRate?.data

        if (data && this.isCurrent(exchangeRate)) {
            return data;
        } else if (data && !this.isCurrent) {

        } else if (!data) {
            // Storage musí parsnout vrátit, já tady uložím, vrátím klientovi atd....
        }

        if (!data) {
            const currTxt = "AHOJ";
            // const currTxt = await this.fetchCurrencies();
            this.currencyStorage.store(currTxt);

            return []
        } else {
            return data;
        }

    }

    private async fetchCurrencies() {
        return await fetch("https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt").then((res) => res.text());
    }

    private isCurrent(exchangeRate: IExchangeRate): boolean {
        const exchangeRateDate: Date = new Date(exchangeRate.fetched_at)

        return true
    }

    public doesCurrencyExist(currency: string): boolean {
        return this.db.chain.get("currencies", [])?.last()?.value()?.data?.findIndex(curr => curr.name === currency) > -1
    }

    public getRate(currency: string): number {
        throw new Error("Method not implemented.");
    }

}
export default CurrencyRepository;