import {AxiosInstance} from "axios";
import {NewGameResponseDto} from "../dto/new-game-response.dto";
import {plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";

export class GameOrchestratorService {
    axios: AxiosInstance

    async startGame(numberOfPlayers: number): Promise<NewGameResponseDto> {
        let {data} = await this.axios.post(`${process.env.BASE_SERVER_URL}${process.env.ORCHESTRATOR_SERVICE_PREFIX}/new-game`, {
            numberOfPlayers
        });

        // We need to cast 'data' to an actual class instance, as Axios only returns a plain object
        const dataAsDto: NewGameResponseDto = plainToInstance(NewGameResponseDto, data as object, {excludeExtraneousValues: true});
        await validateOrReject(dataAsDto);

        return dataAsDto;
    }

    constructor(axios: AxiosInstance) {
        this.axios = axios;
    }
}