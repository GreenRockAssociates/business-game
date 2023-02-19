import {Expose} from "class-transformer";
import {IsUUID} from "class-validator";

export class AddGameIncomingMessageDto {
    @Expose()
    @IsUUID()
    gameId: string

    constructor(gameId: string) {
        this.gameId = gameId;
    }
}