import {IsNotEmpty, IsNumber, IsPositive,} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the NewGame HTTP request
 */
export class buyDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Expose()
    numberOfPlayers : number;



    constructor(numberOfPlayers: number) {
        this.numberOfPlayers = numberOfPlayers;
    }
}