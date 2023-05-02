import DepositDto from "../dtos/deposit_dto.js";
import OpenAccountDTO from "../dtos/open_account.dto.js";
import WithdrawDto from "../dtos/withdraw_dto.js";
import IAccount from "../models/IAccount.js";

export default interface IAccountRepository {

<<<<<<< HEAD
    open(dto: OpenAccountDTO): Promise<IAccount>;
=======
    open(dto: OpenAccountDTO): Promise<boolean>;
>>>>>>> main
    withdraw(dto: WithdrawDto): any;
    deposit(dto: DepositDto): any;
    close(email: string, account_id: string): any
    getHistory(): any
    getUserAccounts(email: string): Promise<IAccount[]>
    // getAccountByCurrency(email: string, currency: string)

}
