import CreateUserDto from "../dtos/create_user.dto.js";
import IUser from "../models/IUser.js";

export default interface IUserRepository {
    findByEmail(email: string): any;
    save(user: CreateUserDto): any; //TODO: Přejmenovat
}