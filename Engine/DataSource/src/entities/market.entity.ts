import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {GameEntity} from "./game.entity";
import {IsBoolean, IsInt, IsNotEmpty, IsNumber, IsPositive} from "class-validator";
import {AssetEntity} from "./asset.entity";
import {DecimalColumnTransformer} from "../transformers/decimalColumn.transformer";

@Entity()
export class MarketEntity {
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    @PrimaryColumn()
    tick: number

    @PrimaryColumn()
    gameId: string

    @PrimaryColumn()
    assetTicker: string

    @ManyToOne(() => GameEntity, (game) => game.markets)
    game: GameEntity

    @ManyToOne(() => AssetEntity, (asset) => asset.markets)
    asset: AssetEntity

    @IsNotEmpty()
    @IsNumber()
    @Column("decimal", { precision: 20, scale: 2,
        transformer: new DecimalColumnTransformer() })
    value: number

    @IsBoolean()
    @Column()
    tradable: boolean


    constructor(tick: number, value: number, tradable: boolean) {
        this.tick = tick;
        this.value = value;
        this.tradable = tradable;
    }
}