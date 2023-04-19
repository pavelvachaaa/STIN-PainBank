import IAccountRepository from "../interfaces/AccountRepository.interface.js";
import IPaymentRepository from "../interfaces/PaymentRepository.interface.js";
import IUserRepository from "../interfaces/UserRepository.interface.js";
import AccountRepository from "../repositories/account.repository.js";
import PaymentRepository from "../repositories/payment.repository.js";
import UserRepository from "../repositories/user.repository.js";

import { Service, Inject, Container } from "typedi";
import { exchangeMoney } from "../utils/account.util.js";
import ICurrencyRepository from "../interfaces/CurrencyRepository.interface.js";
import CurrencyRepository from "../repositories/currency.repository.js";

@Service()
class PaymentService {

    private userRepo: IUserRepository;
    private paymentRepo: IPaymentRepository;
    private accountRepo: IAccountRepository;
    private currencyRepo: ICurrencyRepository;

    constructor(userRepo: UserRepository, paymentRepo: PaymentRepository, accountRepo: AccountRepository, currencyRepo: CurrencyRepository) {
        this.userRepo = userRepo;
        this.paymentRepo = paymentRepo
        this.accountRepo = accountRepo
        this.currencyRepo = currencyRepo;
    }

}

export default PaymentService;