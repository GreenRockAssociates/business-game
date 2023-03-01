import {IsNotEmpty, IsString, IsUUID} from "class-validator";
import {Expose} from "class-transformer";

export class UserEmailResponseDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    @Expose()
    userEmail: string

    constructor(userEmail: string) {
        this.userEmail = userEmail;
    }
}