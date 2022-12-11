// Configure environment variables
// Do this before imports so that all modules can use the environment variables
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

// Libs
import express from 'express';
import session from "express-session";
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

// Connect to databases and run the app once the connection is established
Promise.all([
    AppDataSource.initialize(),
    redisClient.connect()
]).then(() => {
    console.log("Database connected")

    const app = express();
    app.set('trust proxy', 1);
    app.use(session({
        secret: process.env.SECRET,
        name: 'sessionId',
        saveUninitialized: false,
        resave: false,
        proxy: true,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            maxAge: 365*24*60*60*1000, // 1 an
        },
        store: new RedisStore({ client: redisClient })
    }))

    // Parse request body as json
    app.use(express.json());

    // Configuration des routes
    registerRoutes(router, AppDataSource)
    app.use(process.env.SERVICE_URL_PREFIX, router)

    const port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`Authentication service is running on port ${port}.`);
    });
})