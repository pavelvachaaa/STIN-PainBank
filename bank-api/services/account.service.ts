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
import IPayment from "../models/IPayment.js";
import { AppError } from "../vendor/pavel_vacha/exceptions/AppError.js";
import { HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
import OpenAccountDTO from "../dtos/open_account.dto.js";
import WithdrawDto from "../dtos/withdraw_dto.js";
import DepositDto from "../dtos/deposit_dto.js";

@Service()
class AccountService {

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

    open = async (dto: OpenAccountDTO) => {
        if ((await this.accountRepo.getUserAccounts(dto.email)).find((account) => account.currency === dto.currency)) {
            throw new AppError({
                description: "Pro tuto měnu již účet máte",
                name: "ACCOUNT_SERVICE",
                httpCode: HttpCode.BAD_REQUEST
            });
        }

        if (!this.currencyRepo.doesCurrencyExist(dto.currency)) {
            throw new AppError({
                description: "Tuto měnu bohužel zatím nepodporujeme",
                name: "ACCOUNT_SERVICE",
                httpCode: HttpCode.BAD_REQUEST
            });
        }

        return await this.accountRepo.open(dto);
    };

    // TODO: Asi sloučit withdraw a deposit do jednoho???
    withdraw = async (dto: WithdrawDto) => {
        if (typeof dto.amount !== "number" || dto.amount <= 0) {
            throw new AppError({
                description: "Zadali jste neplatnou částku!",
                name: "ACCOUNT_SERVICE",
                httpCode: HttpCode.BAD_REQUEST
            });
        }

        const accounts = await this.accountRepo.getUserAccounts(dto.email);
        if (accounts.length <= 0) {
            throw new AppError({
                description: "Nemáte žádný účet, ze kterého bychom vám vzali částku",
                name: "ACCOUNT_SERVICE",
                httpCode: HttpCode.BAD_REQUEST
            });
        }

        const account = accounts.find((acc) => acc.currency === dto.currency && acc.balance >= dto.amount);
        const payment = {};

        if (account) {
            this.accountRepo.withdraw(dto);
            this.paymentRepo.save({ amount: dto.amount, currency: dto.currency, timestamp: Date.now(), email: dto.email, type: "OUT" });
        } else {
            const currencies = await this.currencyRepo.getLast();

            if (currencies.length <= 0) {
                throw new AppError({
                    description: "Nemohli jsme uskutečnit platbu, omlouváme se, zkuste to znovu později.",
                    name: "ACCOUNT_SERVICE",
                    httpCode: HttpCode.BAD_REQUEST
                });
            }

            const availableAccounts = accounts.filter((acc) => acc.balance >= exchangeMoney(dto.currency, acc.currency, dto.amount, currencies));
            if (availableAccounts.length <= 0) {
                throw new AppError({
                    description: "Nemáte dostatek prostředků na žádným z Vašich účtů",
                    name: "ACCOUNT_SERVICE",
                    httpCode: HttpCode.BAD_REQUEST
                });
            }

            const correctCurrency = availableAccounts[0].currency;
            // TODO: PROMYSLET CO ULOŽIT DO CURRENCY
            dto.amount = exchangeMoney(dto.currency, correctCurrency, dto.amount, currencies);
            this.accountRepo.withdraw(dto);
            /// Zjednodušit save do jednoho callu -> pozor na ammount a jakou currency tam dávám
            this.paymentRepo.save({ amount: dto.amount, currency: correctCurrency, timestamp: Date.now(), email: dto.email, type: "OUT" });
        }

        /// Zkusit vrátit info o tom, jestli to proběhlo. nebo vrátit ten payment nebo účet, asi podle frontendu
        /// Nebo true a pak to na klientovi odečíst

    }

    deposit = async (dto: DepositDto) => {
        if (typeof dto.amount !== "number" || dto.amount <= 0) {
            throw new AppError({
                description: "Zadali jste neplatnou částku!",
                name: "ACCOUNT_SERVICE",
                httpCode: HttpCode.BAD_REQUEST
            });
        }

        const accounts = await this.accountRepo.getUserAccounts(dto.email);
        if (accounts.length <= 0) {
            if (accounts.length <= 0) {
                throw new AppError({
                    description: "Nemáte žádný účet, na který bychom vám připsali částku",
                    name: "ACCOUNT_SERVICE",
                    httpCode: HttpCode.BAD_REQUEST
                });
            }
        }

        const account = accounts.find((account) => account.currency === dto.currency);
        if (account) {
            this.accountRepo.deposit(dto);
        } else {
            // TODO: Do preffered měny asi podle user objektu
            // TODO: If currency not in list
            // TODO: Zjistit jestli odchytneme úspěšné přidání
            const currencies = await this.currencyRepo.getLast();
            if (currencies.length <= 0) {
                throw new AppError({
                    description: "Nemohli jsme uskutečnit platbu, omlouváme se, zkuste to znovu později.",
                    name: "ACCOUNT_SERVICE",
                    httpCode: HttpCode.BAD_REQUEST
                });
            }

            // TODO: Možná bude potřeba uchovat původní amount kvůli historii?
            // TODO: Pozor při save na preffered měnu
            dto.amount = exchangeMoney(dto.currency, "CZK", dto.amount, currencies);
            dto.currency = "CZK"
            this.accountRepo.deposit(dto);
            // TODO: Opravit na něco jako preffered a pozor na historii (možná bude stačit přidat příznak isConvertedToPrefered)
        }

        this.paymentRepo.save({ amount: dto.amount, currency: dto.currency, timestamp: Date.now(), email: dto.email, type: "IN" });
    }

    getHistory = () => {
        throw Error("Not implemented")
    }

    getAccounts = () => {
        throw Error("Not implemented")
    }

    closeAccount = () => {
        throw Error("Not implemented")
    }

}

export default AccountService;