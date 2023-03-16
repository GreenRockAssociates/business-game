import {Expose} from "class-transformer";
import {IsInt, IsNotEmpty, IsPositive, IsString, Matches} from "class-validator";

export class AssetHealthResponseDto {
    @Expose()
    @IsString()
    @Matches(/^[A-Z]{1,5}$/) // Ensure the ticker has a valid format : 4 to 5 uppercase characters
    assetTicker: string

    @Expose()
    @IsInt()
    @IsPositive()
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