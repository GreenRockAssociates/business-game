import {IsUUID} from "class-validator";
import {Expose} from "class-transformer";


export class GameIdDto {

    @IsUUID()
    @Expose()
    gameId : string

    constructor(gameId: string) {

        this.gameId = gameId;
    }

}