import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {IsInt, IsNotEmpty, IsPositive, IsString, MaxLength} from "class-validator";
import {GameEntity} from "./game.entity";
import {AssetEntity} from "./asset.entity";

@Entity()
export class AssetHealthEntity {
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    @PrimaryColumn()
    generatedTick: number

    @PrimaryColumn()
    gameId: string

    @PrimaryColumn()
    assetTicker: string

    @ManyToOne(() => GameEntity, (game) => game.assetHealthEntries)
    game: GameEntity

    @ManyToOne(() => AssetEntity, (asset) => asset.healthEntries)
    asset: AssetEntity

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Column()
    assetRating: string


    constructor(generatedTick: number, assetRating: string) {
        this.generatedTick = generatedTick;
        this.assetRating = assetRating;
    }
}