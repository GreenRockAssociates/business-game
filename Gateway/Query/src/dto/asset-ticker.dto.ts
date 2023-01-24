import {IsString, Matches} from "class-validator";
import {Expose} from "class-transformer";

export class AssetTickerDto {
    @Expose()
    @IsString()
    @Matches(/^[A-Z]{4,5}$/) // Ensure the ticker has a valid format : 4 to 5 uppercase characters
    assetTicker: string
}