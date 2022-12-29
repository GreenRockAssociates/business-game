import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {Trim} from "class-sanitizer";
import {Expose} from "class-transformer";

export class CreateGameRequestDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @Trim()
    @Expose()
    name: string

    constructor(name: string) {
        this.name = name;
    }
}