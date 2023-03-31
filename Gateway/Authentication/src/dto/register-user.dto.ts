import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";
import {NormalizeEmail, Trim} from "class-sanitizer";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the register HTTP request
 */
export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100, {message: "First name cannot be longer than 100 characters"})
    @Trim()
    @Expose()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100, {message: "Last name cannot be longer than 100 characters"})
    @Trim()
    @Expose()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(320, {message: "Email cannot be longer than 320 characters"})
    @IsEmail({}, {message: "Provided Email is not valid"})
    @Trim()
    @NormalizeEmail(true)
    @Expose()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(12, {message: "Password should be minimum of 12 characters"})
    @Expose()
    password: string;


    constructor(firstName: string, lastName: string, email: string, password: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}