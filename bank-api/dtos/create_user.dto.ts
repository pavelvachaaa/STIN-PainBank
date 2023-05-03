import { Matches, IsDefined } from "class-validator";
import { Expose } from "class-transformer";
export default class CreateUserDto {

    @IsDefined()
    @Expose()
    name!: string;

    @IsDefined()
    @Expose()
    // @Matches(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/))
    password!: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    email!: string;

}