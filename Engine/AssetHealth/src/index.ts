// Configure environment variables
// Do this before imports so that all modules can use the environment variables
import dotenv from 'dotenv';
// Libs
import express, {NextFunction, Request, Response} from 'express';

// Custom files
import {AppDataSource} from "@AppDataSource/index";
import {registerRoutes, router} from "./api/api";

dotenv.config({path: __dirname + '/.env'});

// Connect to databases and run the app once the connection is established
Promise.all([
    AppDataSource.initialize(),
]).then(() => {
    console.log("Database connected")

    const app = express();
    app.set('trust proxy', 1);

    // Parse request body as json
    app.use(express.json());

    // Configuration des routes
    registerRoutes(router, AppDataSource)
    app.use(process.env.SERVICE_URL_PREFIX, router)

    // Custom error handling to avoid leaking stack trace
    app.use((err: any, req: Request, res: Response, _: NextFunction) => {
        res.sendStatus(err?.statusCode ?? 500);
    })

    const port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`Asset health service is running on port ${port}.`);
    });
})