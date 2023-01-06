import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Expose} from "class-transformer";

export class InvitePlayerRequestDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Expose()
    playerEmail: string


    constructor(playerEmail: string) {
        this.playerEmail = playerEmail;
    }
}