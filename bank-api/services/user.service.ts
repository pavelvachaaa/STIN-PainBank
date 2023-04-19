import { Service, Inject, Container } from "typedi";
import UserRepository from "../repositories/user.repository.js";
import IUserRepository from "../interfaces/UserRepository.interface.js";
import IUser from "../models/IUser.js";
import hash from "../vendor/pavel_vacha/utils/auth.util.js";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import nodemailer, { Transport, TransportOptions } from "nodemailer";
import IAccountRepository from "../interfaces/AccountRepository.interface.js";
import AccountRepository from "../repositories/account.repository.js";
import Database from "../vendor/pavel_vacha/core/database.js";
import { DatabaseService } from "./database.service.js";
import { AppError, HttpCode } from "../vendor/pavel_vacha/exceptions/AppError.js";
import CreateUserDto from "../dtos/create_user.dto.js";
import OpenAccountDTO from "../dtos/open_account.dto.js";


@Service()
class UserService {
    private userRepo: IUserRepository; // like here
    private accountRepo: IAccountRepository; // like here
    constructor(userRepo: UserRepository, accountRepo: AccountRepository) { // and here
        this.userRepo = userRepo;
        this.accountRepo = accountRepo;
    }

    register = async (user: CreateUserDto) => {
        if (await this.userRepo.findByEmail(user.email)) {
            throw new AppError({ description: "Uživatel  již existuje", httpCode: HttpCode.BAD_REQUEST, isOperational: true });
        }

        user.password = hash(user.password);

        const createdUser: IUser = await this.userRepo.save(user);
        const res = await this.accountRepo.open({ email: user.email, currency: "CZK" });

        // TODO: Případně rollbacky, ale na to sere pes docela
        if (!res) {
            throw new AppError({ description: "Omlouváme se, nepodařilo se nám Vám otevřít účet", httpCode: HttpCode.BAD_REQUEST, isOperational: true });
        }

        return createdUser;
    };
}

// function sendMail() {

//     var transporter = nodemailer.createTransport({
//         host: process.env.SEND_IN_BLUE_HOST,
//         port: process.env.SEND_IN_BLUE_PORT,
//         secure: false,
//         auth: {
//             user: process.env.SEND_IN_BLUE_USER,
//             pass: process.env.SEND_IN_BLUE_PASS
//         },
//     } as TransportOptions | Transport<any>);

//     var mailOptions = {
//         from: 'pavel.vacha@tul.cz',
//         to: 'pavel.vachaaa@gmail.com',
//         subject: 'PainBank - 2FA',
//         text: 'Zasíláme vám kod pro dvoufázové ověření'
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

export default UserService;