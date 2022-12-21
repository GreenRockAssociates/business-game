import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PortfolioEntity} from "./portfolio.entity";
import {DecimalColumnTransformer} from "../transformers/decimalColumn.transformer";
import {IsNotEmpty, IsNumber} from "class-validator";
import {GameEntity} from "./game.entity";

@Entity()
export class PlayerEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @IsNotEmpty()
    @IsNumber()
    @Column("decimal", { precision: 20, scale: 2,
        transformer: new DecimalColumnTransformer() })
    bankAccount: number

    @OneToMany(() => PortfolioEntity, (portfolio) => portfolio.player)
    portfolio: PortfolioEntity[]

    @ManyToOne(() => GameEntity, (game) => game.players)
    game: GameEntity


    constructor(bankAccount: number = 0) {
        this.bankAccount = bankAccount;
    }
}