import {IsString, IsUUID} from "class-validator";
import {Expose} from "class-transformer";


export class GameAndAssetIdDto {

    @IsUUID()
    @Expose()
    gameID : string

    @IsString()
    @Expose()
    assetID : string


    constructor(gameId: string,assetID: string) {

        this.gameID = gameId;
        this.assetID = assetID;
    }

}