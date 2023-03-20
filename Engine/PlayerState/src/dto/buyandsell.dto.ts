import {IsNotEmpty, IsNumber, IsPositive,IsUUID,IsString} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the Buy and sell asset HTTP request
 */
export class BuyandsellDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Expose()
    quantity : number;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    playerId  : string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    assetId   : string;

    constructor(quantity: number,  playerId  : string,assetId   : string) {
        this.quantity = quantity;
        this.playerId = playerId;
        this.assetId = assetId;
    }
}