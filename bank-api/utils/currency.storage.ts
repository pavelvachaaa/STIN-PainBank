import { Service, } from "typedi";
import { saveFile } from "./file.util.js";
import IExchangeRate from "../models/IExchangeRate.js";

@Service()
export default class CurrencyStorage {

    

    getLast() {

    }

    public async store(data: string): Promise<void> {
        await saveFile({ filePath: `${process.env.DATA_PATH}/currencies/currency_${Date.now()}.txt`, data: data.trim() })
    }

}


class CurrencyParser {

    public async parse(data: string): Promise<IExchangeRate[]> {
        throw new Error("Not implemented");
    }

}