import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength} from "class-validator";
import {UserIdTranslationEntity} from "./user-id-translation.entity";
import {InvitationEntity} from "./invitation.entity";

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

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @Column({length: 255, type: "varchar"})
    name: string

    @OneToMany(() => UserIdTranslationEntity, (userIdTranslationEntity: UserIdTranslationEntity) => userIdTranslationEntity.game)
    userIds: UserIdTranslationEntity[]

    @OneToMany(() => InvitationEntity, (invitation: InvitationEntity) => invitation.game)
    invitations: InvitationEntity[]

    constructor(engineId: string, ownerId: string, gameState: GameState = GameState.CREATED, name: string = "A game") {
        this.engineId = engineId;
        this.ownerId = ownerId;
        this.gameState = gameState;
        this.name = name;
    }
}