import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Expose} from "class-transformer";

export class UserEmailResponseDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Expose()
    userEmail: string

    constructor(userEmail: string) {
        this.userEmail = userEmail;
    }
}