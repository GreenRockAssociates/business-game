import {Expose} from "class-transformer";
import {IsNumber, IsPositive, IsUUID} from "class-validator";

export class MarketSimulationIncommingMessageDTO {
    @Expose()
    @IsUUID()
    gameId: string;

    @Expose()
    @IsNumber()
    @IsPositive()
    tick: number;

    @Expose()
    marketState: [string, number][];

    @Expose()
    evolutionVector: [string, number][];

    constructor(gameId: string, tick: number, marketState: [string, number][], evolutionVector: [string, number][]) {
        this.gameId = gameId;
        this.tick = tick;
        this.marketState = marketState;
        this.evolutionVector = evolutionVector;
    }

    getMarketState(): Map<string, number> {
        return new Map(this.marketState);
    }

    setMarketState(map: Map<string, number>){
        this.marketState = [...map];
    }

    getEvolutionVector(): Map<string, number> {
        return new Map(this.evolutionVector);
    }

    setEvolutionVector(map: Map<string, number>){
        this.evolutionVector = [...map];
    }
}