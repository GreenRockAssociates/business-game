import {IsNumber, IsPositive} from "class-validator";
import {Expose} from "class-transformer";

export class CurrentTickDto {
    @IsNumber()
    @IsPositive()
    @Expose()
    currentTick: number


    constructor(currentTick: number) {
        this.currentTick = currentTick;
    }
}