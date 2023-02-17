import {RabbitMqInteractor} from "../message-broker/rabbit-mq-interactor";
import {MockRabbitMqInteractor} from "./mock-rabbit-mq-interactor";

import {DataSource} from "typeorm";
import { AppDataSource } from "../../../DataSource/src";
import {MarketFixture} from "./market-fixture";
import {GameRepository} from "../game-repository";
import {SimulationCadencer, Time} from "../simulation-cadencer";
import {AxiosInstance} from "axios";
import {MockAxios} from "./mock-axios";
import {MockTime} from "./mock-time";
import { MarketEntity } from "../../../DataSource/src/entities/market.entity";
import { GameEntity } from "../../../DataSource/src/entities/game.entity";
import {EvolutionVectorResponseDto} from "../dto/evolution-vector-response.dto";
import {MarketSimulationOutgoingMessageDTO} from "../dto/market-simulation-outgoing-message.dto";
import {GAME_TICK_DURATION_IN_MS} from "../constants/game-cadencing.constants";

describe("Simulation cadencer", () => {
    let rabbitMqInteractor: MockRabbitMqInteractor;

    let dataSource: DataSource;
    let marketFixture: MarketFixture;

    let gameRepository: GameRepository;

    let axiosInstance: MockAxios;

    let time: MockTime;

    let simulationCadencer: SimulationCadencer;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        }) as unknown as DataSource;

        marketFixture = new MarketFixture(dataSource);
        await marketFixture.resetDB();
    })

    beforeEach(async () => {
        rabbitMqInteractor = new MockRabbitMqInteractor();
        gameRepository = new GameRepository();
        axiosInstance = new MockAxios();
        time = new MockTime();

        simulationCadencer = new SimulationCadencer(rabbitMqInteractor as unknown as RabbitMqInteractor, dataSource, gameRepository, axiosInstance as unknown as AxiosInstance, time as Time);
    })

    afterEach(async () => {
        await marketFixture.resetDB();
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    describe("startCadencing", () => {
        it("Should send a new market generation order", async () => {
            const marketEntry: MarketEntity = await marketFixture.insertMarket();
            const game: GameEntity = marketEntry.game;
            gameRepository.addGame(game.id);

            axiosInstance.get.mockImplementation(() => {
                return {data: JSON.stringify(new EvolutionVectorResponseDto([...new Map<string, number>([
                    ["APPL", 0.5]
                ])],1))};
            })

            simulationCadencer.startCadencing();

            // Wait 200ms before ending the simulation cadencing
            await new Promise(r => setTimeout(r, 200));
            simulationCadencer.cadence = false;

            let sendMessageSpy = rabbitMqInteractor.sendToMarketSimulateQueue;
            const expectedMessage = new MarketSimulationOutgoingMessageDTO(game.id, 2, null, null);
            expectedMessage.setMarketState(new Map<string, number>([
                [marketEntry.assetTicker, marketEntry.value]
            ]));
            expectedMessage.setEvolutionVector(new Map<string, number>([
                ["APPL", 0.5]
            ]));

            expect(sendMessageSpy).toHaveBeenCalledTimes(1);
            expect(sendMessageSpy).toHaveBeenCalledWith(expectedMessage);
        })

        it("Should wait approximately GAME_TICK_DURATION_IN_MS between two ticks", async () => {
            const marketEntry: MarketEntity = await marketFixture.insertMarket();
            const game: GameEntity = marketEntry.game;
            gameRepository.addGame(game.id);

            axiosInstance.get.mockImplementation(() => {
                return {data: JSON.stringify(new EvolutionVectorResponseDto([...new Map<string, number>([
                        ["APPL", 0.5]
                    ])],1))};
            })

            let sendMessageTime: number[] = [];
            rabbitMqInteractor.sendToMarketSimulateQueue.mockImplementation(() => {
                sendMessageTime.push(Date.now());
            })

            simulationCadencer.startCadencing();

            // Wait 200ms before ending the simulation cadencing
            await new Promise(r => setTimeout(r, GAME_TICK_DURATION_IN_MS * 1.5));
            simulationCadencer.cadence = false;

            // Expect less than 1% error
            expect(sendMessageTime[1] - sendMessageTime[0]).toBeGreaterThan(GAME_TICK_DURATION_IN_MS * 0.99);
            expect(sendMessageTime[1] - sendMessageTime[0]).toBeLessThan(GAME_TICK_DURATION_IN_MS * 1.01);
        })
    })
})