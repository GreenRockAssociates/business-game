import {DataSource} from "typeorm"
import {ValidationSubscriber} from "../subcribers/validation.subscriber";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env[`TYPEORM_URL`],
    database: "iam",
    synchronize: true,
    logging: process.env.NODE_ENV !== "production",
    entities: [__dirname + '/../entities/**.entity{.ts,.js}'],
    subscribers: [ValidationSubscriber],
    migrations: [],
})