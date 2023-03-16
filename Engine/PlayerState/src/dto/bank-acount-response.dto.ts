import {IsNotEmpty, IsNumber, IsPositive,} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the bank acount reponses HTTP request
 */
export class bankAccountDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Expose()
    money  : number;



    constructor(money : number) {
        this.money  = money ;
    }
}