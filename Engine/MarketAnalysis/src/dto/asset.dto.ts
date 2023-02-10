import {IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID,} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";
import {assetStateDto} from "./assetstate.dto";

/**
 * Data transfer object for the NewGame HTTP request
 */
export class AssetDto{

    @IsUUID()
    @Expose()
    IdGame : string;


    @IsString()
    @IsNotEmpty()
    @Expose()
    Name : string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    Ticker : string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    Description : string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    Logo : string;

    @IsNotEmpty()
    @Expose()
    Assetvalues : assetStateDto[]


    constructor(IdGame: string, Name: string, Ticker: string, Description: string, Logo: string, Assetvalues: assetStateDto[] = []) {
        this.IdGame = IdGame;
        this.Name = Name;
        this.Ticker = Ticker;
        this.Description = Description;
        this.Logo = Logo;
        this.Assetvalues = Assetvalues;
    }
}