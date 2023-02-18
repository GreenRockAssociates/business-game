import client, {Channel, Connection, ConsumeMessage} from "amqplib";
import {MarketSimulationOutgoingMessageDTO} from "../dto/market-simulation-outgoing-message.dto";
import {validateOrReject} from "class-validator";
import {GAME_START_QUEUE_NAME, MARKET_SIMULATION_QUEUE_NAME} from "../constants/rabbit-mq.constants";
import {bindDtoToListener} from "../dto/bind-dto-to-listener";
import {AddGameIncomingMessageDto} from "../dto/add-game-incoming-message.dto";
import {startGameSimulationListenerFactory} from "./listeners/start-game-simulation.listener";
import {GameRepository} from "../game-repository";

export class RabbitMqInteractor {
    private connection: Connection;
    private channel: Channel;

    private async connectToRabbitMQ(url: string){
        this.connection = await client.connect(url)

        this.channel = await this.connection.createChannel()
    }

    private async assertQueues() {
        await this.channel.assertQueue(GAME_START_QUEUE_NAME);
        await this.channel.assertQueue(MARKET_SIMULATION_QUEUE_NAME);
    }

    async initialize(url: string){
        await this.connectToRabbitMQ(url);
        await this.assertQueues();
    }

    async close(){
        await this.channel.close();
        await this.connection.close();
    }

    registerListeners(gameRepository: GameRepository) {
        // Define the constant list of listeners on each queue
        const queueToFunctionMap = new Map<string, (msg: ConsumeMessage) => void>([
            [GAME_START_QUEUE_NAME, bindDtoToListener(AddGameIncomingMessageDto, startGameSimulationListenerFactory(gameRepository))]
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

    async sendToMarketSimulateQueue(message: MarketSimulationOutgoingMessageDTO){
        await validateOrReject(message);
        this.channel.sendToQueue(MARKET_SIMULATION_QUEUE_NAME, this.toBuffer(message));
    }
}