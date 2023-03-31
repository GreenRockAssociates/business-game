import {IsString, IsUUID} from "class-validator";
import {Expose} from "class-transformer";

export class GameIdAndCurrentTickDto {
    @IsUUID()
    @Expose()
    gameId : string

    @IsString()
    @Expose()
    currentTick: string


    constructor(gameId: string, currentTick: string) {
        this.gameId = gameId;
        this.currentTick = currentTick;
    }
}