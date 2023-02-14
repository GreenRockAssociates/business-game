import {GameRepository} from "./game-repository";
import {RabbitMqInteractor} from "./message-broker/rabbit-mq-interactor";
import {GAME_TICK_DURATION_IN_MS, MARKET_CLOSING_HOUR, MARKET_OPENING_HOUR} from "./constants/game-cadencing.constants";
import {MarketSimulationOutgoingMessageDTO} from "./dto/market-simulation-outgoing-message.dto";
import {DataSource} from "typeorm";
import {MarketEntity} from "../../DataSource/src/entities/market.entity";
import axios from "axios";
import {plainToInstance} from "class-transformer";
import {EvolutionVectorResponseDto} from "./dto/evolution-vector-response.dto";
import {validateOrReject} from "class-validator";
import {sanitize} from "class-sanitizer";

export class SimulationCadencer {
    rabbitMQInteractor: RabbitMqInteractor;
    dataSource: DataSource;
    gameRepository: GameRepository;

    constructor(rabbitMQInteractor: RabbitMqInteractor, dataSource: any, gameRepository: GameRepository = new GameRepository()) {
        this.rabbitMQInteractor = rabbitMQInteractor;
        this.dataSource = dataSource as DataSource; // Cast in here because Typescript doesn't like the DataSource type in the constructor parameters
        this.gameRepository = gameRepository;

        this.cadence();
    }

    /**
     * This method generates a new tick for each game tracked by this process at most once per GAME_TICK_DURATION_IN_MS
     *
     * There may be a bit more delay between each tick than wanted, but never less
     * @private
     */
    private async cadence() {
        while (true){
            const expectedEndTime = Date.now() + GAME_TICK_DURATION_IN_MS;

            await Promise.all(
                this.gameRepository.getAllGames().map(gameId => this.generateNewTickForGame(gameId))
            );

            await this.sleepUntilNextTick(expectedEndTime);
        }
    }

    private async sleepUntilNextTick(expectedEndTime: number) {
        const currentDate = new Date()

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

        await new Promise(r => setTimeout(r, expectedEndTime - Date.now())); // Sleep for the remaining duration
        while (Date.now() < expectedEndTime){} // Busy wait to equalize the eventual drift of setTimeout
    }

    private async generateNewTickForGame(gameId: string) {
        try {
            const currentTick: number = await this.getCurrentTickForGame(gameId);
            const [marketState, evolutionVector] = await Promise.all([
                this.getCurrentMarketStateForGame(gameId, currentTick),
                this.getEvolutionVectorForGame(gameId, currentTick)
            ])

            await this.rabbitMQInteractor.sendToMarketSimulateQueue(new MarketSimulationOutgoingMessageDTO(gameId, currentTick, marketState, evolutionVector))

            // TODO: have a chance to generate a News and new market health values
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

    private async getEvolutionVectorForGame(gameId: string, currentTick: number): Promise<Map<string, number>> {
        const response = await axios.get(`${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}/${gameId}/asset-health/evolution-vector/${currentTick}`);

        const responsePlain: object = JSON.parse(response.data);
        const responseDto: EvolutionVectorResponseDto = plainToInstance(EvolutionVectorResponseDto, responsePlain, {excludeExtraneousValues: true});
        await validateOrReject(responseDto);
        sanitize(responseDto);

        return responseDto.vector;
    }
}