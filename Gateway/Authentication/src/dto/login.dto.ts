import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {NormalizeEmail, Trim} from "class-sanitizer";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the login HTTP request
 */
export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message: "Provided Email is not valid"})
    @Trim()
    @NormalizeEmail(true)
    @Expose()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    password: string;


    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}