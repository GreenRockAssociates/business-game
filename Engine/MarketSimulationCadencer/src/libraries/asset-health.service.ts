import axios, {AxiosInstance} from "axios";
import {EvolutionVectorResponseDto} from "../dto/evolution-vector-response.dto";
import {validateOrReject} from "class-validator";
import {plainToInstance} from "class-transformer";
import {sanitize} from "class-sanitizer";

export class AssetHealthService {
    axiosInstance: AxiosInstance;

    async generateNewHealthDataForGame(gameId: string, currentTick: number): Promise<void> {
        await this.axiosInstance.post(`${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}/${gameId}/asset-health/health`, {
            currentTick
        });
    }

    async generateNewsReportForGame(gameId: string, currentTick: number): Promise<void> {
        await this.axiosInstance.post(`${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}/${gameId}/asset-health/news`, {
            currentTick
        });
    }

    async getEvolutionVectorForGame(gameId: string, currentTick: number): Promise<Map<string, number>> {
        const response = await this.axiosInstance.get(`${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}/${gameId}/asset-health/evolution-vector/${currentTick}`);

        const responseDto: EvolutionVectorResponseDto = plainToInstance(EvolutionVectorResponseDto, response.data as object, {excludeExtraneousValues: true});
        await validateOrReject(responseDto);
        sanitize(responseDto);

        return responseDto.getVector();
    }

    constructor(axiosInstance: AxiosInstance = axios.create()) {
        this.axiosInstance = axiosInstance;
    }
}