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

    getVector(): Map<string, number> {
        return new Map(this.vector);
    }

    setVector(vector: Map<string, number>){
        this.vector = [...vector];
    }
}