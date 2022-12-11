import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the register HTTP request
 */
export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(12, {message: "Password should be minimum of 12 characters"})
    @Expose()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(12, {message: "Password should be minimum of 12 characters"})
    @Expose()
    newPassword: string;

    constructor(oldPassword: string, newPassword: string) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
}