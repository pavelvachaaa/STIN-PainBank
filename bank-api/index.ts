import 'express-async-errors';
import "reflect-metadata";

import express, { Express, NextFunction, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import userRoutes from "./routes/user.router.js";
import authRoutes from "./routes/auth.router.js";
import accountRotues from "./routes/account.router.js";
import { createHttpTerminator } from 'http-terminator';
import { errorHandler } from "./vendor/pavel_vacha/exceptions/ErrorHandler.js";
import { ApiResponse } from './vendor/pavel_vacha/interfaces/ApiResponse.interface.js';
import { auth } from './middlewares/auth.middleware.js';

dotenv.config();

export let app: Express = express();
const port = process.env.PORT ?? 4000;
const prefix = process.env.API_PREFIX ?? "/api/v1";

export const server = http.createServer(app);
export const httpTerminator = createHttpTerminator({
    server,
});

app.use(express.json());

app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/account`, accountRotues);


app.get('/', async (req: Request, res: Response) => {
    return new ApiResponse({ data: "data", message: "TADA" }).send(res);
});

app.get('/a', auth, async (req: Request, res: Response) => {
    return new ApiResponse({ data: "data", message: "TADA" }).send(res);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Chyba:', err.message || err);
    next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

server.listen(port, () => {
    console.log(`⚡️[server]: Spustili jsme server na http://localhost:${port}`);
});
