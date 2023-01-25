import {Expose} from "class-transformer";
import {IsUUID} from "class-validator";

export class GameIdDto {
    @Expose()
    @IsUUID()
    gameId: string


    constructor(gameId: string) {
        this.gameId = gameId;
    }
}