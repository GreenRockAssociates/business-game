import {Expose} from "class-transformer";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class AssetHealthResponseDto {
    @Expose()
    @IsString()
    assetTicker: string

    @Expose()
    @IsNumber()
    generatedTick: number

    @Expose()
    @IsString()
    @IsNotEmpty()
    assetRating: string


    constructor(assetTicker: string, generatedTick: number, assetRating: string) {
        this.assetTicker = assetTicker;
        this.generatedTick = generatedTick;
        this.assetRating = assetRating;
    }
}