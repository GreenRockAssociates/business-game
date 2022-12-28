import {GameState} from "../entities/game.entity";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";
import {Expose, Type} from "class-transformer";

export class GameDto {
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
    @Type(() => String)
    invitations?: String[]


    constructor(id: string, name: string, gameState: GameState, ownerId: string, invitations: String[]) {
        this.id = id;
        this.name = name;
        this.gameState = gameState;
        this.ownerId = ownerId;
        this.invitations = invitations;
    }
}