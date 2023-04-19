import { Matches, IsDefined } from "class-validator";
import { Expose } from "class-transformer";
export default class AuthenticateDto {

    @IsDefined()
    @Expose()
    code!: number;

    @IsDefined()
    @Expose()
    auth_request_id!: string;

}