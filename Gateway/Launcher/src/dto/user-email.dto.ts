import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Expose} from "class-transformer";

export class UserEmailDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Expose()
    playerEmail: string

    constructor(playerEmail: string) {
        this.playerEmail = playerEmail;
    }
}