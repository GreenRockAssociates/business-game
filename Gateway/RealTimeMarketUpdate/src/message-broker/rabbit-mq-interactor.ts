import client, {Channel, Connection, Replies} from "amqplib";
import {MarketStateIncomingMessageDto} from "../dto/market-state-incoming-message.dto";
import {MARKET_STATE_EXCHANGE_NAME} from "../constants/rabbit-mq.constants";
import {bindDtoToListener} from "../dto/bind-dto-to-listener";
import {broadcastNewMarketStateListenerFactory} from "./listeners/broadcast-new-market-state.listener";
import {MarketConnectionRepository} from "../web-socket/market-connection-repository";
import AssertQueue = Replies.AssertQueue;

export class RabbitMqInteractor {
    private connection: Connection;
    private channel: Channel;
    private marketStateQueue: AssertQueue;

    private async connectToRabbitMQ(url: string){
        this.connection = await client.connect(url)

        this.channel = await this.connection.createChannel()
    }

    private async assertQueues() {
        await this.channel.assertExchange(MARKET_STATE_EXCHANGE_NAME, 'fanout', {durable: false});
        this.marketStateQueue = await this.channel.assertQueue('', {exclusive: true});
        await this.channel.bindQueue(this.marketStateQueue.queue, MARKET_STATE_EXCHANGE_NAME, '');
    }

    async initialize(url: string){
        await this.connectToRabbitMQ(url);
        await this.assertQueues();
    }

    async close(){
        await this.channel.close();
        await this.connection.close();
    }

    registerListeners(marketConnectionRepository: MarketConnectionRepository) {
        this.channel.consume(
            this.marketStateQueue.queue,
            bindDtoToListener(MarketStateIncomingMessageDto, broadcastNewMarketStateListenerFactory(marketConnectionRepository)),
            {noAck: true}
        );
    }
}