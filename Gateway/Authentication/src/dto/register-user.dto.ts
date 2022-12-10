import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";
import {NormalizeEmail, Trim} from "class-sanitizer";
import {Expose} from "class-transformer";

/**
 * Data tranfer object for the register HTTP request
 */
export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @Trim()
    @Expose()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Trim()
    @Expose()
    lastName: string;

    @IsNotEmpty()
    @IsString()
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