import {DataSource} from "typeorm"
import "reflect-metadata";
import {ValidationSubscriber} from "../subcribers/validation.subscriber";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env[`TYPEORM_URL`],
    database: "iam",
    synchronize: true,
    logging: process.env.NODE_ENV !== "prod",
    entities: ['src/**/**.entity{.ts,.js}'],
    subscribers: [ValidationSubscriber],
    migrations: [],
})