import {AssetEntity} from "./asset.entity";
import {PlayerEntity} from "./player.entity";
import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {DecimalColumnTransformer} from "../transformers/decimalColumn.transformer";
import {IsNotEmpty, IsNumber} from "class-validator";

@Entity()
export class PortfolioEntity {
    @PrimaryColumn()
    assetTicker: string

    @PrimaryColumn()
    playerId: string

    @ManyToOne(() => AssetEntity, (asset) => asset.portfolio)
    asset: AssetEntity

    @ManyToOne(() => PlayerEntity, (player) => player.portfolio)
    player: PlayerEntity

    @IsNotEmpty()
    @IsNumber()
    @Column("decimal", {precision: 20, scale: 2,
        transformer: new DecimalColumnTransformer()})
    count: number

}