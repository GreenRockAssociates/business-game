import {Expose} from "class-transformer";
import {IsBoolean, IsNotEmpty, IsString, IsUUID} from "class-validator";

export class InvitationResponseDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    gameId: string

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    userId: string

    @IsBoolean()
    @Expose()
    acceptedInvitation: boolean


    constructor(gameId: string, userId: string, acceptedInvitation: boolean) {
        this.gameId = gameId;
        this.userId = userId;
        this.acceptedInvitation = acceptedInvitation;
    }
}