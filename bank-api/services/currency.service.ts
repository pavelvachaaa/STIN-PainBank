import IPaymentRepository from "../interfaces/PaymentRepository.interface.js";
import IUserRepository from "../interfaces/UserRepository.interface.js";
import PaymentRepository from "../repositories/payment.repository.js";
import UserRepository from "../repositories/user.repository.js";
import * as fs from 'fs';
import ICurrency from "../models/ICurrency.js";
import { Service, } from "typedi";
import IExchangeRate from "../models/IExchangeRate.js";
<<<<<<< HEAD
import ICurrencyRepository from "../interfaces/CurrencyRepository.interface.js";
import CurrencyRepository from "../repositories/currency.repository.js";
=======
>>>>>>> main

@Service()
class CurrencyService {

    private userRepo: IUserRepository;
    private paymentRepo: IPaymentRepository;
<<<<<<< HEAD
    private currencyRepo: ICurrencyRepository;

    constructor(userRepo: UserRepository, paymentRepo: PaymentRepository, currencyRepo: CurrencyRepository) { // and here
        this.userRepo = userRepo;
        this.paymentRepo = paymentRepo
        this.currencyRepo = currencyRepo
    }

    getLastList = async () => {
        return await this.currencyRepo.getLast();
=======

    constructor(userRepo: UserRepository, paymentRepo: PaymentRepository) { // and here
        this.userRepo = userRepo;
        this.paymentRepo = paymentRepo
>>>>>>> main
    }

    private txtToJson(): void {
        // Test fetch
        // fs.readFile('./data/currencies/currency_14_04_2023.txt', 'utf8', function (err, data) {
        //     if (err) throw err;

        //     const resObject: IExchangeRate = {
        //         fetched_at: 0,
        //         data: []
        //     };

        //     const splitted = data.toString().split("\n");

        //     const parts = splitted[0].split(" ")[0].split(".");
        //     resObject.fetched_at = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10) + 1).getTime()

        //     //země | měna | množství | kód | kurz
        //     for (let i = 2; i < splitted.length; i++) {
        //         let splitLine = splitted[i].split("|");
        //         resObject.data.push({ country: splitLine[0], full_name: splitLine[1], amount: parseInt(splitLine[2]), name: splitLine[3], rate: parseFloat(splitLine[4].replace(",", ".")) })
        //     }

        //     // Save Rates
        // });
    }
}

export default CurrencyService;