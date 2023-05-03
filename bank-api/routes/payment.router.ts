import express, { Request, Response } from 'express';
import { Container } from 'typedi';
import { CustomRequest, auth } from '../middlewares/auth.middleware.js';
import PaymentController from '../controllers/paymentController.js';

const Router = express.Router();
const paymentController = Container.get(PaymentController);

/// TODO: Možná bude stačit jenom servisa
Router.post('/history', auth, (req: Request, res: Response) => paymentController.getByEmail(req as CustomRequest, res));



export default Router;