import {Expose} from "class-transformer";
import {IsUUID} from "class-validator";

export class MarketSimulationOutgoingMessageDTO {
    @Expose()
    @IsUUID()
    gameId: string;

    @Expose()
    marketState: Map<string, number>;

    @Expose()
    evolutionVector: Map<string, number>;


    constructor(gameId: string, marketState: Map<string, number>, evolutionVector: Map<string, number>) {
        this.gameId = gameId;
        this.marketState = marketState;
        this.evolutionVector = evolutionVector;
    }
}