// Configure environment variables
// Do this before imports so that all modules can use the environment variables
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

// Libs
import express, { Request, Response, NextFunction } from 'express';

// Custom files
import {AppDataSource} from "./libraries/database";
import {router} from "./api/api";

// Connect to database and run the app once the connection is established
AppDataSource.initialize().then(() => {
    console.log("Database connected")

    const app = express();

    // Parse request body as json
    app.use(express.json());

    // Configuration des routes
    app.use('/api/', router)

    const port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`Authentication service is running on port ${port}.`);
    });
})