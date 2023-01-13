import {Expose} from "class-transformer";
import {IsNotEmpty, IsUUID} from "class-validator";

export class NewGameResponseDto {
    @IsUUID()
    @Expose()
    gameEngineId: string

    @IsUUID("all", {
        each: true
    })
    @IsNotEmpty()
    @Expose()
    playerIds: string[]


    constructor(gameEngineId: string, playerIds: string[]) {
        this.gameEngineId = gameEngineId;
        this.playerIds = playerIds;
    }
}