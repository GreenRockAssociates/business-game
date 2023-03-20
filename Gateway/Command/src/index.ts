// Configure environment variables
// Do this before imports so that all modules can use the environment variables
import dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env'});

// Libs
import express, {Request, Response, NextFunction} from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';

// Custom files
import {router, registerRoutes} from "./api/api";
import {csrfProtection} from "./api/middlewares/csrf-protection.middleware";

const app = express();
app.set('trust proxy', 1);

// Enable CORS
app.use(cors({
    origin: process.env.CORS_URL,
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

// CSRF Mitigation
app.use(cookieParser());
app.use(csrfProtection);

// Parse request body as json
app.use(express.json());

// Configuration des routes
registerRoutes(router)
app.use(`${process.env.SERVICE_URL_PREFIX}`, router)

// Custom error handling to avoid leaking stack trace
app.use((err: any, req: Request, res: Response, _: NextFunction) => {
    console.error(err);
    res.sendStatus(err?.statusCode ?? 500);
})

const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`Command service is running on port ${port}.`);
});