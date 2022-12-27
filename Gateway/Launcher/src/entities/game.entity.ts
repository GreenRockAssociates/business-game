import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsOptional, IsString, IsUUID} from "class-validator";
import {UserIdTranslationEntity} from "./user-id-translation.entity";

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

    @OneToMany(() => UserIdTranslationEntity, (userIdTranslationEntity: UserIdTranslationEntity) => userIdTranslationEntity.game)
    userIds: UserIdTranslationEntity[]

    constructor(engineId: string, ownerId: string, gameState: GameState = GameState.CREATED) {
        this.engineId = engineId;
        this.ownerId = ownerId;
        this.gameState = gameState;
    }
}