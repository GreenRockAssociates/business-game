import {Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {IsInt, IsNotEmpty, IsPositive, IsString, MaxLength} from "class-validator";
import {GameEntity} from "./game.entity";
import {AssetEntity} from "./asset.entity";

@Entity()
export class NewsReportEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => GameEntity, (game) => game.newsReportEntries)
    game: GameEntity

    @ManyToMany(() => AssetEntity, (asset: AssetEntity) => asset.newsReportEntries)
    assets: AssetEntity[]

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    @PrimaryColumn()
    generatedTick: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Column("varchar", { length: 200 })
    title: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    @Column("varchar", { length: 10000 })
    content: string

    @IsNotEmpty()
    @Column()
    influenceFactor: number

    constructor(generatedTick: number, title: string, content: string, influenceFactor: number) {
        this.generatedTick = generatedTick;
        this.title = title;
        this.content = content;
        this.influenceFactor = influenceFactor;
    }
}