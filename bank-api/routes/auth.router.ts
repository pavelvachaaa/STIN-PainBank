import express, { Request, Response } from 'express';
import { Container } from 'typedi';
import AuthController from '../controllers/auth.controller.js';
import { requestValidator } from '../middlewares/input_validator.middleware.js';
import StartAuthDto from '../dtos/start_auth.dto.js';
import AuthenticateDto from '../dtos/authenticate.dto.js';

const Router = express.Router();
const authController = Container.get(AuthController);

Router.post('/startAuthentication', requestValidator(StartAuthDto), (req: Request, res: Response) => authController.startAuthentication(req, res));
Router.post('/authenticate', requestValidator(AuthenticateDto), (req: Request, res: Response) => authController.authenticate(req, res));


export default Router;