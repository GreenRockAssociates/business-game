import {Expose} from "class-transformer";
import {IsString, IsUUID, Matches} from "class-validator";

export class GameIdAndAssetTickerDto {
    @IsUUID()
    @Expose()
    gameId : string

    @Expose()
    @IsString()
    @Matches(/^[A-Z]{4,5}$/) // Ensure the ticker has a valid format : 4 to 5 uppercase characters
    assetTicker: string

    constructor(gameId: string, assetTicker: string) {
        this.gameId = gameId;
        this.assetTicker = assetTicker;
    }
}