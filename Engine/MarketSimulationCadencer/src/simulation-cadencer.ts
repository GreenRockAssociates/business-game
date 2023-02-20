import {GameRepository} from "./game-repository";
import {RabbitMqInteractor} from "./message-broker/rabbit-mq-interactor";
import {
    GAME_TICK_DURATION_IN_MS,
    MARKET_CLOSING_HOUR,
    MARKET_OPENING_HOUR, NEW_NEWS_REPORT_PROBABILITY,
    TIME_BETWEEN_NEW_HEALTH_IN_TICK, TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT_IN_TICK
} from "./constants/game-cadencing.constants";
import {MarketSimulationOutgoingMessageDTO} from "./dto/market-simulation-outgoing-message.dto";
import {DataSource} from "typeorm";
import {MarketEntity} from "../../DataSource/src/entities/market.entity";
import {AssetHealthService} from "./libraries/asset-health.service";

export class Time {
    getCurrentDate(): Date {
        return new Date();
    }

    getCurrentTime(): number {
        return Date.now();
    }
}

export class SimulationCadencer {
    rabbitMQInteractor: RabbitMqInteractor;
    dataSource: DataSource;
    gameRepository: GameRepository;
    assetHealthService: AssetHealthService;
    time: Time;

    cadence: boolean = true;

    constructor(rabbitMQInteractor: RabbitMqInteractor, dataSource: any, gameRepository: GameRepository, assetHealthService: AssetHealthService = new AssetHealthService(), time: Time = new Time()) {
        this.rabbitMQInteractor = rabbitMQInteractor;
        this.dataSource = dataSource as DataSource; // Cast in here because Typescript doesn't like the DataSource type in the constructor parameters
        this.gameRepository = gameRepository;
        this.assetHealthService = assetHealthService;
        this.time = time;
    }

    /**
     * This method generates a new tick for each game tracked by this process at most once per GAME_TICK_DURATION_IN_MS
     *
     * There may be a bit more delay between each tick than wanted, but never less
     * @private
     */
    async startCadencing() {
        while (this.cadence){
            const expectedEndTime = this.time.getCurrentTime() + GAME_TICK_DURATION_IN_MS;

            await Promise.all(
                this.gameRepository.getAllGames().map(gameId => this.generateNewTickForGame(gameId))
            );

            await this.sleepUntilNextTick(expectedEndTime);
        }
    }

    private async sleepUntilNextTick(expectedEndTime: number) {
        const currentDate = this.time.getCurrentDate()

        // If we are outside the market hours, change the endTime to be at 8AM on the next/current day (depending on if we are before or after midnight)
        if (currentDate.getHours() >= MARKET_CLOSING_HOUR){
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 1);
            endDate.setHours(MARKET_OPENING_HOUR, 0, 0, 0);
            expectedEndTime = endDate.getTime();
        } else if (currentDate.getHours() < MARKET_OPENING_HOUR ){
            const endDate = new Date(currentDate);
            endDate.setHours(MARKET_OPENING_HOUR, 0, 0, 0);
            expectedEndTime = endDate.getTime();
        }

        await new Promise(r => {setTimeout(r, expectedEndTime - this.time.getCurrentTime() - 20)}); // Sleep for a bit less than the remaining duration
        while (this.time.getCurrentTime() < expectedEndTime){} // Busy wait to equalize the eventual drift of setTimeout
    }

    private async generateNewTickForGame(gameId: string) {
        try {
            const currentTick: number = await this.getCurrentTickForGame(gameId);

            await Promise.all([
                this.orderComputeMarketEvolution(gameId, currentTick),
                this.tryGenerateNewHealthData(gameId, currentTick),
                this.tryGenerateNewNewsReport(gameId, currentTick)
            ]);
        } catch (_) {
            console.error(`Cannot generate tick for game ${gameId}`);
        }
    }

    private async getCurrentTickForGame(gameId: string): Promise<number> {
        // Get the tick value of the latest entry in the market database
        return (await this.dataSource.getRepository(MarketEntity).findOne({
            where: {
                game: {
                    id: gameId
                }
            },
            order: {
                tick: "DESC"
            }
        })).tick;
    }

    private async orderComputeMarketEvolution(gameId: string, currentTick: number): Promise<void> {
        const [marketState, evolutionVector] = await Promise.all([
            this.getCurrentMarketStateForGame(gameId, currentTick),
            this.assetHealthService.getEvolutionVectorForGame(gameId, currentTick)
        ])

        const message = new MarketSimulationOutgoingMessageDTO(gameId, currentTick+1, null, null);
        message.setMarketState(marketState);
        message.setEvolutionVector(evolutionVector);
        await this.rabbitMQInteractor.sendToMarketSimulateQueue(message);
    }

    private async getCurrentMarketStateForGame(gameId: string, currentTick: number): Promise<Map<string, number>> {
        const market: MarketEntity[] = await this.dataSource.getRepository(MarketEntity).find({
            where: {
                game: {
                    id: gameId
                },
                tick: currentTick
            }
        });
        return new Map(market.map(marketEntry => [marketEntry.assetTicker, marketEntry.value]));
    }

    private async tryGenerateNewHealthData(gameId: string, currentTick: number): Promise<void> {
        if (currentTick % TIME_BETWEEN_NEW_HEALTH_IN_TICK === 0){
            await this.assetHealthService.generateNewHealthDataForGame(gameId, currentTick);
        }
    }

    private async tryGenerateNewNewsReport(gameId: string, currentTick: number): Promise<void> {
        if (currentTick % TIME_BETWEEN_NEW_NEWS_REPORT_ATTEMPT_IN_TICK === 0 && Math.random() < NEW_NEWS_REPORT_PROBABILITY){
            await this.assetHealthService.generateNewsReportForGame(gameId, currentTick);
        }
    }
}