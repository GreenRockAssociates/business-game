import axios, {AxiosInstance} from "axios";

export class AssetHealthService {
    axiosInstance: AxiosInstance;

    async generateNewHealthDataForGame(gameId: string, currentTick: number): Promise<void> {
        await this.axiosInstance.post(`${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}/${gameId}/asset-health/health`, {
            currentTick
        });
    }

    constructor(axiosInstance: AxiosInstance = axios.create()) {
        this.axiosInstance = axiosInstance;
    }
}