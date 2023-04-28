import { Service } from "typedi";
import ICurrencyRepository from "../interfaces/CurrencyRepository.interface.js";
import ICurrency from "../models/ICurrency.js";
import { DatabaseService } from "../services/database.service.js";

@Service()
export class CurrencyRepository implements ICurrencyRepository {

    constructor(private db: DatabaseService) {
    }

    public save() {
        throw new Error("Method not implemented.");
    }

    public getLast(): ICurrency[] {
        return this.db.chain.get("currencies", []).last().value().data;
    }

    public doesCurrencyExist(currency: string): boolean {
        return this.db.chain.get("currencies", []).last().value().data?.findIndex(curr => curr.name === currency) > -1
    }

    public getRate(currency: string): number {
        throw new Error("Method not implemented.");
    }

}
export default CurrencyRepository;