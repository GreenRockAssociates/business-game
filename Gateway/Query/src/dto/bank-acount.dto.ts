import {Expose} from "class-transformer";
import {IsNumber, IsPositive} from "class-validator";

export class BankAcountDto {
    @Expose()
    @IsNumber()
    @IsPositive()
    money: number;


    constructor(money: number) {
        this.money = money;
    }
}