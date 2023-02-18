import client, {Channel, Connection, ConsumeMessage} from "amqplib";
import {MarketSimulationIncomingMessageDTO} from "../dto/market-simulation-incomming-message.dto";
import {validateOrReject} from "class-validator";
import {MARKET_SIMULATION_QUEUE_NAME, MARKET_STATE_QUEUE_NAME} from "../constants/rabbit-mq.constants";
import {bindDtoToListener} from "../dto/bind-dto-to-listener";
import {generateNewMarketStateListenerFactory} from "./listeners/generate-new-market-state.listener";
import {MarketStateOutgoingMessageDto} from "../dto/market-state-outgoing-message.dto";
import {DataSource} from "typeorm";

export class RabbitMqInteractor {
    private connection: Connection;
    private channel: Channel;

    private async connectToRabbitMQ(url: string){
        this.connection = await client.connect(url);

        this.channel = await this.connection.createChannel();
    }

    private async assertQueues() {
        await this.channel.assertQueue(MARKET_SIMULATION_QUEUE_NAME);
        await this.channel.assertQueue(MARKET_STATE_QUEUE_NAME);
    }

    async initialize(url: string){
        await this.connectToRabbitMQ(url);
        await this.assertQueues();
    }

    async close(){
        await this.channel.close();
        await this.connection.close();
    }

    registerListeners(dataSource: any) {
        // Define the constant list of listeners on each queue
        const queueToFunctionMap = new Map<string, (msg: ConsumeMessage) => void>([
            [MARKET_SIMULATION_QUEUE_NAME, bindDtoToListener(MarketSimulationIncomingMessageDTO, generateNewMarketStateListenerFactory(this, dataSource as DataSource))]
        ])

        // Register each one
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

    async sendToMarketStateQueue(message: MarketStateOutgoingMessageDto){
        await validateOrReject(message);
        this.channel.sendToQueue(MARKET_STATE_QUEUE_NAME, this.toBuffer(message));
    }
}