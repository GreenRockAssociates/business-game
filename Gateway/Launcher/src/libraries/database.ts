import {DataSource} from "typeorm"
import "reflect-metadata";
import {ValidationSubscriber} from "../subcribers/validation.subscriber";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.TYPEORM_URL,
    database: "launcher",
    synchronize: true,
    logging: process.env.NODE_ENV == "dev",
    entities: ['src/**/**.entity{.ts,.js}'],
    subscribers: [ValidationSubscriber],
    migrations: [],
})