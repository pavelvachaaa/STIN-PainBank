import { Service, } from "typedi";
import { mkdir, getMostRecentFile, readFile, saveFile } from "./file.util.js";
import IExchangeRate from "../models/IExchangeRate.js";


@Service()
class CurrencyParser {
    public parse(data: string): IExchangeRate {
        const exchangeRate: IExchangeRate = {
            fetched_at: Date.now(),
            data: []
        };

        const splitted = data.toString().split("\n");

        //země | měna | množství | kód | kurz
        for (let i = 2; i < splitted.length; i++) {
            let splitLine = splitted[i].split("|");
            exchangeRate.data.push({ country: splitLine[0], full_name: splitLine[1], amount: parseInt(splitLine[2]), name: splitLine[3], rate: parseFloat(splitLine[4].replace(",", ".")) })
        }

        return exchangeRate;
    }
}

@Service()
export default class CurrencyStorage {

    constructor(private currencyParser: CurrencyParser) { }

    public async getLast(): Promise<IExchangeRate> {
        let exchangeRate: IExchangeRate;
        const refDate = new Date();
        refDate.setHours(14, 20, 0, 0)

        // Pozn. nevytváří se vždycky, když existuje funkce prostě vrací true.
        await mkdir({ dirPath: `${process.env.DATA_PATH}/currencies` })

        const { latestPath, date } = await getMostRecentFile(`${process.env.DATA_PATH}/currencies`)


        if ((!date || !latestPath) || (date < refDate)) {
            const data = (await this.fetchCurrencies()).trim();
            await this.store(data);
            exchangeRate = this.currencyParser.parse(data);
        } else {
            const data = (await readFile({ filePath: latestPath })).toString();
            exchangeRate = this.currencyParser.parse(data.trim());
        }

        return exchangeRate;
    }

    private async store(data: string): Promise<void> {
        await saveFile({ filePath: `${process.env.DATA_PATH}/currencies/currency_${Date.now()}.txt`, data: data })
    }

    private async fetchCurrencies() {
        return await fetch(process.env.CNB_URL as string).then((res) => res.text());
    }

}
