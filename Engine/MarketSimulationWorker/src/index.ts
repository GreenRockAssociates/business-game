// Configure environment variables
import dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env'}); // Do this before imports so that all modules can use the environment variables

// Custom files
import {AppDataSource} from "../../DataSource/src/index";
import {RabbitMqInteractor} from "./message-broker/rabbit-mq-interactor";

const rabbitMQInteractor: RabbitMqInteractor = new RabbitMqInteractor();

// Connect to databases and run the app once the connection is established
Promise.all([
    AppDataSource.initialize(),
    rabbitMQInteractor.initialize(process.env.RABBIT_MQ_URL)
]).then(async () => {
    console.log("Database connected")
    console.log(`Connection to RabbitMQ ok`);

    await rabbitMQInteractor.registerListeners(AppDataSource);
})