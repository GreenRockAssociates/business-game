import {Expose} from "class-transformer";
import {IsNumber, IsPositive, IsUUID} from "class-validator";

export class MarketSimulationOutgoingMessageDTO {
    @Expose()
    @IsUUID()
    gameId: string;

    @Expose()
    @IsNumber()
    @IsPositive()
    currentTick: number;

    @Expose()
    marketState: Map<string, number>;

    @Expose()
    evolutionVector: Map<string, number>;

    constructor(gameId: string, currentTick: number, marketState: Map<string, number>, evolutionVector: Map<string, number>) {
        this.gameId = gameId;
        this.currentTick = currentTick;
        this.marketState = marketState;
        this.evolutionVector = evolutionVector;
    }
}