import {Expose, Type} from "class-transformer";
import {IsArray, IsNumber, Matches, ValidateNested} from "class-validator";
import 'reflect-metadata';

export class PortfolioDto {
    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PortfolioEntryDto)
    portfolio: PortfolioEntryDto[]

    constructor(portfolio: PortfolioEntryDto[]) {
        this.portfolio = portfolio;
    }
}

export class PortfolioEntryDto {
    @Expose()
    @Matches(/^[A-Z]{4,5}$/) // Ensure the ticker has a valid format : 4 to 5 uppercase characters
    assetId: string

    @Expose()
    @IsNumber()
    quantity: number

    constructor(assetId: string, quantity: number) {
        this.assetId = assetId;
        this.quantity = quantity;
    }
}