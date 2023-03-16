import {IsUUID} from "class-validator";
import {Expose} from "class-transformer";


export class IdsDto {

    @IsUUID()
    @Expose()
    gameID : string

    @IsUUID()
    @Expose()
    playerID : string

    constructor(gameId: string,playerID : string) {

        this.gameID = gameId;
        this.playerID = playerID;
    }

}