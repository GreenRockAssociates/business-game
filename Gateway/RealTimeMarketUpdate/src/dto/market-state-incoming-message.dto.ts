import {Expose} from "class-transformer";
import {IsNumber, IsPositive, IsUUID} from "class-validator";

export class MarketStateIncomingMessageDto {
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
}