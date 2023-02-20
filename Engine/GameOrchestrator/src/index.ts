// Configure environment variables
import dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env'}); // Do this before imports so that all modules can use the environment variables
// Libs
import express, {NextFunction, Request, Response} from 'express';

// Custom files
import {AppDataSource} from "../../DataSource/src/index";
import {registerRoutes, router} from "./api/api";
import {RabbitMqInteractor} from "./message-broker/rabbit-mq-interactor";

const rabbitMqInteractor: RabbitMqInteractor = new RabbitMqInteractor();

// Connect to databases and run the app once the connection is established
Promise.all([
    AppDataSource.initialize(),
    rabbitMqInteractor.initialize(process.env.RABBIT_MQ_URL)
]).then(() => {
    console.log("Database connected")
    console.log("Connection to RabbitMQ ok")

    const app = express();
    app.set('trust proxy', 1);

    // Parse request body as json
    app.use(express.json());

    // Configuration des routes
    registerRoutes(router, AppDataSource, rabbitMqInteractor)
    app.use(process.env.SERVICE_URL_PREFIX, router)

    // Custom error handling to avoid leaking stack trace
    app.use((err: any, req: Request, res: Response, _: NextFunction) => {
        res.sendStatus(err?.statusCode ?? 500);
    })

    const port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`Game orchestrator service is running on port ${port}.`);
    });
})