import {IsNotEmpty, IsNumber, IsPositive, Min,} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the NewGame HTTP request
 */
export class NewGameDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Expose()
    numberOfPlayers : number;

    constructor(numberOfPlayers: number) {
        this.numberOfPlayers = numberOfPlayers;
    }
}