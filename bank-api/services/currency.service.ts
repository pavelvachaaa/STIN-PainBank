import IPaymentRepository from "../interfaces/PaymentRepository.interface.js";
import IUserRepository from "../interfaces/UserRepository.interface.js";
import PaymentRepository from "../repositories/payment.repository.js";
import UserRepository from "../repositories/user.repository.js";
import { Service, } from "typedi";
import ICurrencyRepository from "../interfaces/CurrencyRepository.interface.js";
import CurrencyRepository from "../repositories/currency.repository.js";

@Service()
class CurrencyService {

    private currencyRepo: ICurrencyRepository;

    constructor(currencyRepo: CurrencyRepository) {
        this.currencyRepo = currencyRepo
    }

    getLastList = async () => {
        return await this.currencyRepo.getLast();
    }
}

export default CurrencyService;