import {IsUUID} from "class-validator";
import {Expose} from "class-transformer";

export class GameIdInEngineInternalResponseDto {
    @IsUUID()
    @Expose()
    engineId: string


    constructor(engineId: string) {
        this.engineId = engineId;
    }
}