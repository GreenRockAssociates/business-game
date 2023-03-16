import {IsUUID} from "class-validator";
import {Expose} from "class-transformer";


export class GameIdDto {

    @IsUUID()
    @Expose()
    gameID : string

    constructor(gameId: string) {

        this.gameID = gameId;
    }

}