import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";
import {GameEntity} from "./game.entity";

@Entity()
export class InvitationEntity {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @PrimaryColumn()
    userId: string

    @PrimaryColumn()
    gameId: string

    @ManyToOne(() => GameEntity, (game: GameEntity) => game.invitations)
    game: GameEntity

    @Column()
    acceptedInvitation: boolean


    constructor(userId: string, acceptedInvitation: boolean = false) {
        this.userId = userId;
        this.acceptedInvitation = acceptedInvitation;
    }
}