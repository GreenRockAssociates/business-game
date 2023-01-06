import {Expose} from "class-transformer";
import {IsBoolean, IsNotEmpty, IsString, IsUUID} from "class-validator";

export class InvitationResponseDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    userId: string

    @IsBoolean()
    @Expose()
    acceptedInvitation: boolean


    constructor(userId: string, acceptedInvitation: boolean) {
        this.userId = userId;
        this.acceptedInvitation = acceptedInvitation;
    }
}