import client, {Channel, Connection} from "amqplib";
import {validateOrReject} from "class-validator";
import {GAME_START_QUEUE_NAME} from "../constants/rabbit-mq.constants";
import {AddGameOutgoingMessageDto} from "../dto/add-game-outgoing-message.dto";

export class RabbitMqInteractor {
    private connection: Connection;
    private channel: Channel;

    private async connectToRabbitMQ(url: string){
        this.connection = await client.connect(url);

        this.channel = await this.connection.createChannel();
    }

    private async assertQueues() {
        await this.channel.assertQueue(GAME_START_QUEUE_NAME);
    }

    async initialize(url: string){
        await this.connectToRabbitMQ(url);
        await this.assertQueues();
    }

    async close(){
        await this.channel.close();
        await this.connection.close();
    }

    private toBuffer<T>(message: T): Buffer {
        return Buffer.from(JSON.stringify(message));
    }

    async sendToGameStartQueue(message: AddGameOutgoingMessageDto){
        await validateOrReject(message);
        this.channel.sendToQueue(GAME_START_QUEUE_NAME, this.toBuffer(message));
    }
}