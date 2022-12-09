// Libs
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Custom files
import {AppDataSource} from "./libraries/database";
import {router} from "./api/api";

// Configure environment variables
dotenv.config({path: '.env'});

// Connect to database and run the app once the connection is established
AppDataSource.initialize().then(() => {
    console.log("Database connected")

    const app = express();

    // Configuration des routes
    app.use('/api/', router)

    const port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`Authentication service is running on port ${port}.`);
    });
})