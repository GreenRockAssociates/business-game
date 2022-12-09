import {DataSource} from "typeorm"
import {UserEntity} from "../entities/user.entity";
import "reflect-metadata";

import dotenv from 'dotenv';
dotenv.config({path: '.env'});

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env[`TYPEORM_URL`],
    database: "iam",
    synchronize: true,
    logging: true,
    entities: [UserEntity],
    subscribers: [],
    migrations: [],
})