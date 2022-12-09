// Libs
import express, { Request, Response, NextFunction } from 'express';

// Configure environment variables
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

// Custom imports
import {router} from "./api/api";

const index = express();

// Configuration des routes
index.use('/api/', router)

const port = process.env.PORT;
index.listen(port, () => {
    console.log(`Authentication service is running on port ${port}.`);
});