import dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env'}); // Do this before imports so that all modules can use the environment variables

import {migrate} from "./ini/bdd_ini";

(async () => {
    await migrate();
    console.log("Database filled")
})()