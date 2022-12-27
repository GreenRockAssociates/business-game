import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsOptional, IsString, IsUUID} from "class-validator";

export enum GameState {
    CREATED,
    STARTED,
    ENDED
}

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @IsOptional()
    @IsString()
    @IsUUID()
    @Column("uuid", {
        unique: true,
        nullable: true,
    })
    engineId: string

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Column("uuid")
    ownerId: string

    @IsNotEmpty()
    @Column()
    gameState: GameState


    constructor(engineId: string, ownerId: string, gameState: GameState = GameState.CREATED) {
        this.engineId = engineId;
        this.ownerId = ownerId;
        this.gameState = gameState;
    }
}