import {Expose} from "class-transformer";
import {IsUUID} from "class-validator";

export class GameIdDto {
    @IsUUID()
    @Expose()
    gameId: string


    constructor(gameId: string) {
        this.gameId = gameId;
    }
}