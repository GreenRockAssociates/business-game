import {IsNotEmpty, IsString, IsUUID} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the login HTTP request
 */
export class SessionDataResponseDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }
}