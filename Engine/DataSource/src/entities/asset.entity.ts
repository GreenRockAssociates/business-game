import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {SectorEntity} from "./sector.entity";
import {PortfolioEntity} from "./portfolio.entity";

@Entity()
export class AssetEntity {
    @IsNotEmpty()
    @IsString()
    @MaxLength(5)
    @PrimaryColumn("varchar", { length: 5 })
    ticker: string


    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @Column("varchar", { length: 255 })
    name: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(2000)
    @Column("varchar", { length: 2000 })
    description: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    @Column("varchar", { length: 200 })
    logo: string

    @ManyToMany(() => SectorEntity, (sector: SectorEntity) => sector.assets, {cascade: true})
    @JoinTable()
    sectors : SectorEntity[]

    @OneToMany(() => PortfolioEntity, (portfolio) => portfolio.asset)
    portfolio: PortfolioEntity[]

    constructor(ticker: string, name: string, description: string, logo: string) {
        this.ticker = ticker;
        this.name = name;
        this.description = description;
        this.logo = logo;
    }
}