import {Expose} from "class-transformer";
import {IsNumber, IsPositive} from "class-validator";

export class EvolutionVectorResponseDto {
    @Expose()
    vector: Map<string, number>;

    @Expose()
    @IsNumber()
    @IsPositive()
    tick: number;


    constructor(vector: Map<string, number>, tick: number) {
        this.vector = vector;
        this.tick = tick;
    }
}