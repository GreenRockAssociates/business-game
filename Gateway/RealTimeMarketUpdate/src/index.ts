import dotenv from 'dotenv';
import {MarketUpdatesWebSocketServer} from "./web-socket/market-updates-web-socket-server";
import {RabbitMqInteractor} from "./message-broker/rabbit-mq-interactor";
import {MarketConnectionRepository} from "./web-socket/market-connection-repository";
dotenv.config({path: __dirname + '/.env'});

const rabbitMqInteractor: RabbitMqInteractor = new RabbitMqInteractor();
const marketConnectionRepository = new MarketConnectionRepository();

Promise.all([
    rabbitMqInteractor.initialize(process.env.RABBIT_MQ_URL)
]).then(async () => {
    console.log(`Connection to RabbitMQ ok`);

    new MarketUpdatesWebSocketServer(marketConnectionRepository);
    await rabbitMqInteractor.registerListeners(marketConnectionRepository);
})