import {Expose} from "class-transformer";
import {IsNumber, IsPositive} from "class-validator";

export class EvolutionVectorResponseDto {
    @Expose()
    vector: [string, number][];

    @Expose()
    @IsNumber()
    @IsPositive()
    tick: number;


    constructor(vector: [string, number][], tick: number) {
        this.vector = vector;
        this.tick = tick;
    }

    getEvolutionVector(): Map<string, number> {
        return new Map(this.vector);
    }

    setEvolutionVector(map: Map<string, number>){
        this.vector = [...map];
    }
}