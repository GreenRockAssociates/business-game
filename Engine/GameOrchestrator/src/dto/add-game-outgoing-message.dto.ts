import {Expose} from "class-transformer";
import {IsUUID} from "class-validator";

export class AddGameOutgoingMessageDto {
    @Expose()
    @IsUUID()
    gameId: string

    constructor(gameId: string) {
        this.gameId = gameId;
    }
}