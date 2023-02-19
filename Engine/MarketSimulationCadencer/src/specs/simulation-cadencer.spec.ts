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
import {GAME_TICK_DURATION_IN_MS, TIME_BETWEEN_NEW_HEALTH_IN_TICK, TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT_IN_TICK} from "../constants/game-cadencing.constants"; // Even though we replace the values, we still need to import them
import {AssetHealthService} from "../libraries/asset-health.service";

// Used to change the news generation probability at runtime so the test isn't flaky
const mock_NEW_NEWS_REPORT_PROBABILITY_Getter = jest.fn();
// Override the constants with our own values so the tests are consistent
jest.mock("../constants/game-cadencing.constants", () => ({
    get GAME_TICK_DURATION_IN_MS(){
        return 100; // Make ticks much shorter so the tests run faster
    },
    get MARKET_OPENING_HOUR(){
        return 8;
    },
    get MARKET_CLOSING_HOUR(){
        return 20;
    },
    get TIME_BETWEEN_NEW_HEALTH_IN_TICK(){
        return 3600;
    },
    get TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT_IN_TICK(){
        return 150;
    },
    get NEW_NEWS_REPORT_PROBABILITY() {
        return mock_NEW_NEWS_REPORT_PROBABILITY_Getter();
    }
}));

describe("Simulation cadencer", () => {
    let rabbitMqInteractor: MockRabbitMqInteractor;

    let dataSource: DataSource;
    let marketFixture: MarketFixture;

    let gameRepository: GameRepository;

    let axiosInstance: MockAxios;
    let assetHealthService: AssetHealthService;

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
        assetHealthService = new AssetHealthService(axiosInstance as unknown as AxiosInstance);
        time = new MockTime(new Date("2023-01-01T12:00:00.000Z")); // Set the time at midday so the test doesn't fail at night

        simulationCadencer = new SimulationCadencer(rabbitMqInteractor as unknown as RabbitMqInteractor, dataSource, gameRepository, assetHealthService, time as Time);
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

            // Wait GAME_TICK_DURATION_IN_MS/5ms before ending the simulation cadencing
            await new Promise(r => setTimeout(r, GAME_TICK_DURATION_IN_MS/5));
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

        it("Should generate multiple ticks", async () => {
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

            // Leave enough time to run the loop several times
            await new Promise(r => setTimeout(r, GAME_TICK_DURATION_IN_MS * 3));
            simulationCadencer.cadence = false;

            expect(sendMessageTime.length).toBeGreaterThan(1);
        })

        it("Should generate new health data every TIME_BETWEEN_NEW_HEALTH_IN_TICK tick", async () => {
            const marketEntry: MarketEntity = await marketFixture.insertMarket({tick: TIME_BETWEEN_NEW_HEALTH_IN_TICK});
            const game: GameEntity = marketEntry.game;
            gameRepository.addGame(game.id);

            axiosInstance.get.mockImplementation(() => {
                return {data: JSON.stringify(new EvolutionVectorResponseDto([...new Map<string, number>([
                        ["APPL", 0.5]
                    ])], TIME_BETWEEN_NEW_HEALTH_IN_TICK))};
            })

            simulationCadencer.startCadencing();

            // Wait GAME_TICK_DURATION_IN_MS/5ms before ending the simulation cadencing
            await new Promise(r => setTimeout(r, GAME_TICK_DURATION_IN_MS/5));
            simulationCadencer.cadence = false;

            let postSpy = axiosInstance.post;
            expect(postSpy).toHaveBeenCalledTimes(1);
            expect(postSpy).toHaveBeenCalledWith(`${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}/${game.id}/asset-health/health`, {currentTick: TIME_BETWEEN_NEW_HEALTH_IN_TICK});
        })

        it("Should generate a new news report every TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT (if the probability check succeeds)", async () => {
            // Override the probability value so the test doesn't depend on a random value to succeed
            mock_NEW_NEWS_REPORT_PROBABILITY_Getter.mockReturnValue(1);

            const marketEntry: MarketEntity = await marketFixture.insertMarket({tick: TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT_IN_TICK});
            const game: GameEntity = marketEntry.game;
            gameRepository.addGame(game.id);

            axiosInstance.get.mockImplementation(() => {
                return {data: JSON.stringify(new EvolutionVectorResponseDto([...new Map<string, number>([
                        ["APPL", 0.5]
                    ])], TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT_IN_TICK))};
            })

            simulationCadencer.startCadencing();

            // Wait GAME_TICK_DURATION_IN_MS/5ms before ending the simulation cadencing
            await new Promise(r => setTimeout(r, GAME_TICK_DURATION_IN_MS/5));
            simulationCadencer.cadence = false;

            let postSpy = axiosInstance.post;
            expect(postSpy).toHaveBeenCalledTimes(1);
            expect(postSpy).toHaveBeenCalledWith(`${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}/${game.id}/asset-health/news`, {currentTick: TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT_IN_TICK});
        })
    })
})