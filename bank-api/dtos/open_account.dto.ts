import { Matches, IsDefined } from "class-validator";
import { Expose } from "class-transformer";

export default class OpenAccountDTO {

    @IsDefined()
    @Expose()
    currency!: string;

    @IsDefined()
    @Expose()
    email!: string;

}