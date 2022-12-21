import {DataSource} from "typeorm"
import "reflect-metadata";
import {ValidationSubscriber} from "./subcribers/validation.subscriber";
import { join } from "path";

import dotenv from 'dotenv';
dotenv.config({path: '.env'});

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env[`TYPEORM_URL`],
    database: "game",
    synchronize: true,
    logging: false,
    entities: [join(__dirname, '/**/**.entity{.ts,.js}')],
    subscribers: [ValidationSubscriber],
})