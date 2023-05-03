import express, { Request, Response } from 'express';
import { Container } from 'typedi';
import CurrencyController from '../controllers/currency.controller.js';

const Router = express.Router();
const currencyController = Container.get(CurrencyController);

Router.get('/', (req: Request, res: Response) => currencyController.getLastList(req, res));



export default Router;