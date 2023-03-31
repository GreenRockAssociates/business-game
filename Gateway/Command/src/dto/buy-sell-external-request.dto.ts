import {Expose} from "class-transformer";
import {IsNumber, Matches} from "class-validator";

export class BuySellExternalRequestDto {
    @Expose()
    @Matches(/^[A-Z]{1,5}$/) // Ensure the ticker has a valid format : 1 to 5 uppercase characters
    assetId: string

    @Expose()
    @IsNumber()
    quantity: number


    constructor(assetId: string, quantity: number) {
        this.assetId = assetId;
        this.quantity = quantity;
    }
}