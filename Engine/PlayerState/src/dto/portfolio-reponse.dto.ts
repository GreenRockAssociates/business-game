import {IsNotEmpty, IsNumber,IsString,IsPositive} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";
import {PortfolioEntity} from "../../../DataSource/src/entities/portfolio.entity";


/**
 * Data transfer object for the portfolio HTTP request
 */

export class portfolioDTO {
    @IsNotEmpty()
    @IsString()
    @Expose()
    assetId   : string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Expose()
    quantity: number;

    constructor(entityPort : PortfolioEntity ) {
        this.assetId = entityPort.assetTicker;
        this.quantity = entityPort.count

    }
}
