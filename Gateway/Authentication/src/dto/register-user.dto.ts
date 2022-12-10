import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";
import {Trim} from "class-sanitizer";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @Trim()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Trim()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message: "Provided Email is not valid"})
    @Trim()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(12, {message: "Password should be minimum of 12 characters"})
    password: string;


    constructor(firstName: string, lastName: string, email: string, password: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}