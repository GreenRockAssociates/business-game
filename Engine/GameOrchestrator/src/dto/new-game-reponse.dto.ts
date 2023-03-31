import {ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the NewGame HTTP request
 */
export class newgameResponseDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @Expose()
    gameEngineId : string;


    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsString({each: true})

    @Expose()
    playerIds  : string[];


    constructor(gameId : string,playerIds : string[] ) {
        this.gameEngineId  = gameId ;
        this.playerIds = playerIds ;
    }
}