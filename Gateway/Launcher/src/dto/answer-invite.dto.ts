import {Expose} from "class-transformer";
import {IsBoolean, IsUUID} from "class-validator";

export class AnswerInviteDto {
    @IsUUID()
    @Expose()
    gameId: string

    @IsBoolean()
    @Expose()
    accept: boolean

    constructor(gameId: string, accept: boolean) {
        this.gameId = gameId;
        this.accept = accept;
    }
}