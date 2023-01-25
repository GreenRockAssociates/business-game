import {HttpService} from "./http.service";
import {PlayerSessionData} from "../interfaces/session-data.interface";
import {NewsResponseDto} from "../dto/news-response.dto";
import {AssetHealthResponseDto} from "../dto/asset-health-response.dto";
import {AssetTickerDto} from "../dto/asset-ticker.dto";

export class AssetHealthService {
    readonly httpService: HttpService
    readonly baseServiceUrl: string

    async getAllNews(sessionData: PlayerSessionData): Promise<NewsResponseDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/asset-health/news`;
        return this.httpService.executeGetRequest(url, NewsResponseDto);
    }

    async getNewsForAsset(sessionData: PlayerSessionData, assetId: AssetTickerDto): Promise<NewsResponseDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/asset-health/news/${assetId.assetTicker}`;
        return this.httpService.executeGetRequest(url, NewsResponseDto);
    }

    async getAssetHealthData(sessionData: PlayerSessionData, assetId: AssetTickerDto): Promise<AssetHealthResponseDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/asset-health/health/${assetId.assetTicker}`;
        return this.httpService.executeGetRequest(url, AssetHealthResponseDto);
    }

    constructor(httpService: HttpService = new HttpService()) {
        this.httpService = httpService;
        this.baseServiceUrl = `${process.env.BASE_SERVER_URL}${process.env.ASSET_HEALTH_SERVICE_PREFIX}`
    }
}