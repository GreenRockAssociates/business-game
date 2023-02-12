import {IsNumber, IsPositive, IsUUID} from "class-validator";
import {Expose} from "class-transformer";

export class GameIdAndCurrentTickDto {
    @IsUUID()
    @Expose()
    gameId : string

    @IsNumber()
    @IsPositive()
    @Expose()
    currentTick: number


    constructor(gameId: string, currentTick: number) {
        this.gameId = gameId;
        this.currentTick = currentTick;
    }
}