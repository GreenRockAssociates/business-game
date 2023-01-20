import {DataSource} from "typeorm"
import {ValidationSubscriber} from "../subcribers/validation.subscriber";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.TYPEORM_URL,
    database: "launcher",
    synchronize: true,
    logging: process.env.NODE_ENV == "dev",
    entities: [__dirname + '/../entities/**.entity{.ts,.js}'],
    subscribers: [ValidationSubscriber],
    migrations: [],
})