import express, { Request, Response } from 'express';
import { Container } from 'typedi';
import UserController from '../controllers/user.controller.js';
import { requestValidator } from '../middlewares/input_validator.middleware.js';
import CreateUserDto from '../dtos/create_user.dto.js';

const Router = express.Router();
const userController = Container.get(UserController);

Router.post('/register', requestValidator(CreateUserDto), (req: Request, res: Response) => userController.register(req, res));



export default Router;