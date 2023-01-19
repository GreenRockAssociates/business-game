import {GameState} from "../entities/game.entity";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";
import {Expose, Type} from "class-transformer";
import {InvitationResponseDto} from "./invitation-response.dto";

export class GameResponseDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    id: string

    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string

    @Expose()
    gameState: GameState

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    ownerId: string

    @Expose()
    @Type(() => InvitationResponseDto)
    invitations?: InvitationResponseDto[]


    constructor(id: string, name: string, gameState: GameState, ownerId: string, invitations: InvitationResponseDto[]) {
        this.id = id;
        this.name = name;
        this.gameState = gameState;
        this.ownerId = ownerId;
        this.invitations = invitations;
    }
}