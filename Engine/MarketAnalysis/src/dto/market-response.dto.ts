import {Expose, Type} from "class-transformer";
import {IsArray, IsBoolean, IsInt, IsNumber, IsPositive, IsString, Matches, ValidateNested} from "class-validator";
import 'reflect-metadata';

export class MarketResponseDto {
    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MarketEntryDto)
    market: MarketEntryDto[]

    constructor(market: MarketEntryDto[]) {
        this.market = market;
    }
}

export class MarketEntryDto {
    @Expose()
    @IsString()
    @Matches(/^[A-Z]{1,5}$/) // Ensure the ticker has a valid format : 4 to 5 uppercase characters
    assetId: string

    @Expose()
    @IsInt()
    @IsPositive()
    tick: number

    @Expose()
    @IsNumber()
    @IsPositive()
    value: number

    @Expose()
    @IsBoolean()
    tradable: boolean


    constructor(assetId: string, tick: number, value: number, tradable: boolean) {
        this.assetId = assetId;
        this.tick = tick;
        this.value = value;
        this.tradable = tradable;
    }
}
