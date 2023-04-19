import { Matches, IsDefined } from "class-validator";
import { Expose } from "class-transformer";
export default class StartAuthDto {

    @IsDefined()
    @Expose()
    email!: string;

    @IsDefined()
    @Expose()
    password!: string;

}