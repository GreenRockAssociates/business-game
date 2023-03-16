import {Expose} from "class-transformer";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";

export class InvitationIdentifierDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    gameId: string

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    invitedUserId: string

    constructor(gameId: string, invitedUserId: string) {
        this.gameId = gameId;
        this.invitedUserId = invitedUserId;
    }
}