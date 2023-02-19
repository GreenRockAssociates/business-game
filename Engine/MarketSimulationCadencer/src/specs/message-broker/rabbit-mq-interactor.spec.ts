import {RabbitMqInteractor} from "../../message-broker/rabbit-mq-interactor";
import {GameRepository} from "../../game-repository";
import client, {Channel, Connection, ConsumeMessage} from "amqplib";
import {GAME_START_QUEUE_NAME, MARKET_SIMULATION_QUEUE_NAME} from "../../constants/rabbit-mq.constants";
import {AddGameIncomingMessageDto} from "../../dto/add-game-incoming-message.dto";
import {MarketSimulationOutgoingMessageDTO} from "../../dto/market-simulation-outgoing-message.dto";
import {plainToInstance} from "class-transformer";

describe('rabit MQ interactor', function () {
    let rabbitMQInteractor: RabbitMqInteractor;

    beforeEach(async () => {
        rabbitMQInteractor = new RabbitMqInteractor();
        await rabbitMQInteractor.initialize(process.env.RABBIT_MQ_URL);
    })

    afterEach(async () => {
        await rabbitMQInteractor.close();
    })

    it("Should register listeners properly", async () => {
        const gameRepositorySpy = {
            addGame: jest.fn()
        }
        rabbitMQInteractor.registerListeners(gameRepositorySpy as unknown as GameRepository);
        const connection: Connection = await client.connect(process.env.RABBIT_MQ_URL);
        const channel: Channel = await connection.createChannel();
        await channel.assertQueue(GAME_START_QUEUE_NAME);

        const message = new AddGameIncomingMessageDto("145bd0b9-137d-4345-b3b0-84c1dc60cbc4");
        channel.sendToQueue(GAME_START_QUEUE_NAME, Buffer.from(JSON.stringify(message)));

        // Sleep to let enough time for the message to be sent and received
        await new Promise(r => setTimeout(r, 50));
        expect(gameRepositorySpy.addGame).toHaveBeenCalledTimes(1);
        expect(gameRepositorySpy.addGame).toHaveBeenCalledWith(message.gameId);

        await channel.close();
        await connection.close();
    })

    it('should be able to send message', async function () {
        const connection: Connection = await client.connect(process.env.RABBIT_MQ_URL);
        const channel: Channel = await connection.createChannel();
        await channel.assertQueue(MARKET_SIMULATION_QUEUE_NAME);
        let receivedMessage: MarketSimulationOutgoingMessageDTO;
        await channel.consume(MARKET_SIMULATION_QUEUE_NAME, async (msg: ConsumeMessage) => {
            const plain: object = JSON.parse(msg.content.toString());
            receivedMessage = plainToInstance(MarketSimulationOutgoingMessageDTO, plain, { excludeExtraneousValues: true });
            channel.ack(msg);
        });

        const sentMessage = new MarketSimulationOutgoingMessageDTO("0f28f172-accf-4bb7-b8c9-a87e01f620e1", 1, [["APPL", 10]], [["APPL", 0.5]])
        await rabbitMQInteractor.sendToMarketSimulateQueue(sentMessage);

        // Sleep to let enough time for the message to be sent and received
        await new Promise(r => setTimeout(r, 50));
        expect(receivedMessage).not.toBeUndefined();
        expect(receivedMessage).toEqual(sentMessage);

        await channel.close();
        await connection.close();
    });
});