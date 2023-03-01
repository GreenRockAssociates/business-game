import {Expose} from "class-transformer";
import {IsBoolean, IsEmail, IsNotEmpty, IsString, IsUUID} from "class-validator";

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

    @IsNotEmpty()
    @IsEmail()
    @Expose()
    userEmail: string

    @IsBoolean()
    @Expose()
    acceptedInvitation: boolean


    constructor(gameId: string, userId: string, userEmail: string, acceptedInvitation: boolean) {
        this.gameId = gameId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.acceptedInvitation = acceptedInvitation;
    }
}