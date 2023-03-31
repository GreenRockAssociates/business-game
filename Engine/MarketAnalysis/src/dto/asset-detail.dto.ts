import {Expose, Type} from "class-transformer";
import {IsArray, IsNotEmpty, IsString, Matches, ValidateNested} from "class-validator";

export class AssetDetailDto {
    @Expose()
    @IsString()
    @Matches(/^[A-Z]{1,5}$/) // Ensure the ticker has a valid format : 4 to 5 uppercase characters
    assetTicker: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    description: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    logo: string

    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => String)
    sectors: string[]


    constructor(assetTicker: string, name: string, description: string, logo: string, sectors: string[]) {
        this.assetTicker = assetTicker;
        this.name = name;
        this.description = description;
        this.logo = logo;
        this.sectors = sectors;
    }
}