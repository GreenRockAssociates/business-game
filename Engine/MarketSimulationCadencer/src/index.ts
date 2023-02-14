// Configure environment variables
import dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env'}); // Do this before imports so that all modules can use the environment variables

// Custom files
import {AppDataSource} from "../../DataSource/src/index";

// Connect to databases and run the app once the connection is established
Promise.all([
    AppDataSource.initialize(),
]).then(() => {
    console.log("Database connected")

    const port = process.env.APP_PORT;
})