import {Expose} from "class-transformer";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";

export class AssetHealthResponseDto {
    @Expose()
    @IsUUID()
    assetTicker: string

    @Expose()
    @IsString()
    @IsNotEmpty()
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