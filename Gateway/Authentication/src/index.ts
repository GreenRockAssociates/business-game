// Configure environment variables
// Do this before imports so that all modules can use the environment variables
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

// Libs
import express, {Request, Response, NextFunction} from 'express';
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from 'cors';
let RedisStore = require("connect-redis")(session)

// Redis for the session store
const { createClient } = require("redis")
let redisClient = createClient({
    url: process.env.REDIS_URL,
    legacyMode: true
})

// Custom files
import {AppDataSource} from "./libraries/database";
import {router, registerRoutes} from "./api/api";
import {csrfProtection} from "./api/middlewares/csrf-protection.middleware";

// Connect to databases and run the app once the connection is established
Promise.all([
    AppDataSource.initialize(),
    redisClient.connect()
]).then(() => {
    console.log("Database connected")

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

    // Session
    app.use(session({
        secret: process.env.SECRET,
        saveUninitialized: false,
        resave: false,
        proxy: true,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            maxAge: 365*24*60*60*1000, // 1 an
            sameSite: true
        },
        store: new RedisStore({ client: redisClient })
    }))

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
        console.log(`Authentication service is running on port ${port}.`);
    });
})