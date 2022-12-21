import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsString} from "class-validator";
import {PlayerEntity} from "./player.entity";
import {AssetHealthEntity} from "./asset-health.entity";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @IsNotEmpty()
    @IsString()
    @Column()
    gameState: string

    @OneToMany(() => PlayerEntity, (player) => player.game)
    players: PlayerEntity[]

    @OneToMany(() => AssetHealthEntity, (assetHealth) => assetHealth.game)
    assetHealthEntries: AssetHealthEntity[]


    constructor(gameState: string = "Created") {
        this.gameState = gameState;
    }
}