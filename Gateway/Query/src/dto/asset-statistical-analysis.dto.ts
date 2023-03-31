import {IsNumber} from "class-validator";
import {Expose} from "class-transformer";

export class AssetStatisticalAnalysisDto {
    @IsNumber()
    @Expose()
    valueAtRisk : number

    @IsNumber()
    @Expose()
    expectedReturn : number

    @IsNumber()
    @Expose()
    beta : number


    constructor(valueAtRisk: number, expectedReturn: number, beta: number) {
        this.valueAtRisk = valueAtRisk;
        this.expectedReturn = expectedReturn;
        this.beta = beta;
    }
}