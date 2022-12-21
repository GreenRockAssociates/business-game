import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsString} from "class-validator";
import {PlayerEntity} from "./player.entity";

@Entity()
export class GameEntity {
    @IsNotEmpty()
    @IsString()
    @PrimaryGeneratedColumn("uuid")
    id: string

    @IsNotEmpty()
    @IsString()
    @Column()
    gameState: string

    @OneToMany(() => PlayerEntity, (player) => player.game)
    players: PlayerEntity[]
}