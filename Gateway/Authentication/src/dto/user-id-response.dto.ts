import {IsNotEmpty, IsString, IsUUID} from "class-validator";
import {Expose} from "class-transformer";

export class UserIdResponseDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    @Expose()
    userId: string

    constructor(userId: string) {
        this.userId = userId;
    }
}