import {IsNotEmpty, IsNumber, IsPositive,} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the health for an asset HTTP request
 */
export class healthDto {
    @IsNotEmpty()
    @Expose()
    health : string;



    constructor(health: string) {
        this.health = health;
    }
}