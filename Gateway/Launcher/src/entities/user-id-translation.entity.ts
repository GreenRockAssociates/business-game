import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {GameEntity} from "./game.entity";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";

@Entity()
export class UserIdTranslationEntity {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @PrimaryColumn()
    userId: string

    @PrimaryColumn()
    gameId: string

    @ManyToOne(() => GameEntity, (game: GameEntity) => game.userIds)
    game: GameEntity

    @IsString()
    @IsUUID()
    @Column("uuid")
    enginePlayerId: string

    constructor(userId: string, enginePlayerId: string) {
        this.userId = userId;
        this.enginePlayerId = enginePlayerId;
    }
}