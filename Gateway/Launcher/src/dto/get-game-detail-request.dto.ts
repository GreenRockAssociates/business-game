import {Expose} from "class-transformer";
import {IsUUID} from "class-validator";

export class GetGameDetailRequestDto {
    @IsUUID()
    @Expose()
    gameId: string


    constructor(gameId: string) {
        this.gameId = gameId;
    }
}