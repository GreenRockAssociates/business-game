import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {Expose} from "class-transformer";

export class UserEmailDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Expose()
    userEmail: string

    constructor(userEmail: string) {
        this.userEmail = userEmail;
    }
}