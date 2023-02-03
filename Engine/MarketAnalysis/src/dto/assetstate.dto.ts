import {IsBoolean, IsNumber, IsPositive, IsString} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the NewGame HTTP request
 */
export class assetStateDto{

    @IsString()
    @Expose()
    AssetTicker : string;

    @IsNumber()
    @Expose()
    GameTick : number;

    @IsNumber()
    @IsPositive()
    @Expose()
    value : number;

    @IsBoolean()
    @Expose()
    tradable : boolean;


    constructor(AssetTicker: string, GameTick: number, value: number, tradable: boolean) {
        this.AssetTicker = AssetTicker;
        this.GameTick = GameTick;
        this.value = value;
        this.tradable = tradable;
    }
}