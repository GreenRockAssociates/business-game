import client, {Channel, Connection, ConsumeMessage} from "amqplib";
import {MarketSimulationOutgoingMessageDTO} from "../dto/market-simulation-outgoing-message.dto";
import {validateOrReject} from "class-validator";

const GAME_START_QUEUE_NAME = "game.start";
const MARKET_SIMULATION_QUEUE_NAME = "market.simulate";

export class RabbitMqInteractor {
    private channel: Channel;

    private async connectToRabbitMQ(url: string){
        const connection: Connection = await client.connect(url)

        this.channel = await connection.createChannel()
    }

    private async assertQueues() {
        await this.channel.assertQueue(GAME_START_QUEUE_NAME);
        await this.channel.assertQueue(MARKET_SIMULATION_QUEUE_NAME);
    }

    async initialize(url: string){
        await this.connectToRabbitMQ(url);
        await this.assertQueues();
        console.log(`Connection to RabbitMQ at ${url} ok`);
    }

    registerListeners(queueToFunctionMap: Map<string, (msg: ConsumeMessage) => void>) {
        queueToFunctionMap.forEach((callback, queue) => {
            this.channel.consume(queue, async (msg: ConsumeMessage) => {
                await callback(msg);
                this.channel.ack(msg);
            });
        })
    }

    private toBuffer<T>(message: T): Buffer {
        return Buffer.from(JSON.stringify(message));
    }

    async sendToMarketSimulateQueue(message: MarketSimulationOutgoingMessageDTO){
        await validateOrReject(message);
        this.channel.sendToQueue(MARKET_SIMULATION_QUEUE_NAME, this.toBuffer(message));
    }
}