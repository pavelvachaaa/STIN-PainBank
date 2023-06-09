import { Service } from "typedi";
import IAccountRepository from "../interfaces/AccountRepository.interface.js";
import IAccount from "../models/IAccount.js";
import { DatabaseService } from "../services/database.service.js";
import OpenAccountDTO from "../dtos/open_account.dto.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
import IUser from "../models/IUser.js";
import generateAccountNumber from "../utils/account.util.js";
import WithdrawDto from "../dtos/withdraw_dto.js";
import DepositDto from "../dtos/deposit_dto.js";

@Service()
export class AccountRepository implements IAccountRepository {
    constructor(private db: DatabaseService) {
    }

    async open(dto: OpenAccountDTO): Promise<IAccount> {
        if ((await this.getUserAccounts(dto.email)).find((account) => account.currency === dto.currency)) {
            throw new AppError({
                description: "Pro tuto měnu již účet máte",
                name: "ACCOUNT_SERVICE",
                httpCode: HttpCode.BAD_REQUEST
            });
        }

        const acc: IAccount = { account_id: generateAccountNumber(), balance: 0, currency: dto.currency };
        const res = (this.db.chain.get("users").find({ email: dto.email }).value().accounts ?? []).push(acc);

        await this.db.write();

        return acc;
    }

    async getUserAccounts(email: string): Promise<IAccount[]> {
        return this.db.findOne<IUser>("users", { email: email })?.accounts ?? []
    }

    async withdraw(dto: WithdrawDto) {
        let account = this.db.chain.get("users").find({ email: dto.email }).get("accounts").find({ currency: dto.currency }).value();
        if (!account) {
            throw new AppError({ description: "Nemohli jsme najít účet, ze kterého vybrat prostředky", httpCode: HttpCode.BAD_REQUEST });
        }

        account.balance -= dto.amount;
        await this.db.write();
    }

    async deposit(dto: DepositDto) {
        this.db.chain.get("users").find({ email: dto.email }).get("accounts").find({ currency: dto.currency }).value().balance += dto.amount;
        await this.db.write();
    }


    close(email: string, account_id: string) {
        throw new Error("Method not implemented.");
    }

    getHistory() {
        throw new Error("Method not implemented.");
    }


}
export default AccountRepository;