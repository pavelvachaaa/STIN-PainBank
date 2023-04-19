import { Service, } from "typedi";
import IUserRepository from "../interfaces/UserRepository.interface.js";
import { v4 as uuidv4 } from 'uuid';
import IUser from "../models/IUser.js";
import { DatabaseService } from "../services/database.service.js";
import DatabaseScheme from "../types/database_sceheme.type.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
import CreateUserDto from "../dtos/create_user.dto.js";

@Service()
export class UserRepository implements IUserRepository {

    constructor(private db: DatabaseService) {
    }

    public findByEmail(email: string): IUser {
        return this.db.findOne<IUser>("users", { email: email });
    }

    public async save(user: CreateUserDto): Promise<IUser> {
        if (this.db.findOne<IUser>("users", { email: user.email })) {
            throw new AppError({ description: "Uživatel s tímto emailem již existuje", httpCode: HttpCode.BAD_REQUEST, isOperational: true });
        }

        const newUser = { ...user, accounts: [] };
        this.db.chain.get("users", []).value().push(newUser);
        await this.db.write()
        return newUser;
    }
}
export default UserRepository;