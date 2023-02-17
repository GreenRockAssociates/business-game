import {Expose} from "class-transformer";
import {IsNumber, IsPositive, IsUUID} from "class-validator";

export class MarketStateOutgoingMessageDto {
    @Expose()
    @IsUUID()
    gameId: string;

    @Expose()
    @IsNumber()
    @IsPositive()
    tick: number;

    @Expose()
    marketState: [string, number][];


    constructor(gameId: string, tick: number, marketState: [string, number][]) {
        this.gameId = gameId;
        this.tick = tick;
        this.marketState = marketState;
    }

    getMarketState(): Map<string, number> {
        return new Map(this.marketState);
    }

    setMarketState(map: Map<string, number>){
        this.marketState = [...map];
    }
}