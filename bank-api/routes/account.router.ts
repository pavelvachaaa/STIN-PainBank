import express, { Request, Response } from 'express';
import { Container } from 'typedi';
import { CustomRequest, auth } from '../middlewares/auth.middleware.js';
import AccountController from '../controllers/account.controller.js';
import { requestValidator } from '../middlewares/input_validator.middleware.js';
import OpenAccountDTO from '../dtos/open_account.dto.js';
import WithdrawDto from '../dtos/withdraw_dto.js';
import DepositDto from '../dtos/deposit_dto.js';

const Router = express.Router();
const accountController = Container.get(AccountController);

Router.post('/open', requestValidator(OpenAccountDTO), auth, (req: Request, res: Response) => accountController.open(req as CustomRequest, res));
Router.post('/withdraw', requestValidator(WithdrawDto), auth, (req: Request, res: Response) => accountController.withdraw(req as CustomRequest, res));
Router.post('/deposit', requestValidator(DepositDto), auth, (req: Request, res: Response) => accountController.deposit(req as CustomRequest, res));
Router.post('/get', auth, (req: Request, res: Response) => accountController.getUserAccounts(req as CustomRequest, res));

export default Router;