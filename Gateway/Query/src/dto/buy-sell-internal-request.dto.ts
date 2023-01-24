import {Expose} from "class-transformer";
import {IsNumber, IsUUID, Matches} from "class-validator";

export class BuySellInternalRequestDto {
    @Expose()
    @IsUUID()
    playerId: string

    @Expose()
    @Matches(/[A-Z]{4,5}/) // Ensure the ticker has a valid format : 4 to 5 uppercase characters
    assetId: string

    @Expose()
    @IsNumber()
    quantity: number


    constructor(playerId: string, assetId: string, quantity: number) {
        this.playerId = playerId;
        this.assetId = assetId;
        this.quantity = quantity;
    }
}