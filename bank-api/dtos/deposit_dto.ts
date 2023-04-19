import { Matches, IsDefined } from "class-validator";
import { Expose } from "class-transformer";
export default class DepositDto {

    @IsDefined()
    @Expose()
    amount!: number;

    @IsDefined()
    @Expose()
    currency!: string;

    @IsDefined()
    @Expose()
    email!: string;

}