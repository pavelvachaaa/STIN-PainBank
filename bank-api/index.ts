import 'express-async-errors';
import "reflect-metadata";

import express, { Express, NextFunction, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { createHttpTerminator } from 'http-terminator';
import { errorHandler } from "./vendor/pavel_vacha/exceptions/ErrorHandler.js";
import { ApiResponse } from './vendor/pavel_vacha/interfaces/ApiResponse.interface.js';

dotenv.config();

export let app: Express = express();
const port = process.env.PORT ?? 4000;
const prefix = process.env.API_PREFIX ?? "/api/v1";

export const server = http.createServer(app);
export const httpTerminator = createHttpTerminator({
    server,
});


app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
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
