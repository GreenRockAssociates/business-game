import {IsNotEmpty, IsNumber, IsUUID,IsString,IsPositive,ValidateNested} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the portfolio HTTP request
 */

export class porfolio {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    assetId   : string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Expose()
    quanity: number;
}
export class allportfolioDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Expose()
    portfolio  : porfolio[];



    constructor(portfolio : porfolio[]) {
        this.portfolio  = portfolio ;
    }
}