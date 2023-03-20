import {HttpService} from "./http.service";
import {PlayerSessionData} from "../interfaces/session-data.interface";
import {MarketResponseDto} from "../dto/market-response.dto";
import {AssetTickerDto} from "../dto/asset-ticker.dto";
import {AssetDetailDto} from "../dto/asset-detail.dto";
import {AssetStatisticalAnalysisDto} from "../dto/asset-statistical-analysis.dto";

export class MarketAnalysisService {
    readonly httpService: HttpService
    readonly baseServiceUrl: string

    async getMarketRate(sessionData: PlayerSessionData): Promise<MarketResponseDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/market/market-rate`;
        return this.httpService.executeGetRequest(url, MarketResponseDto);
    }

    async getAssetDetail(sessionData: PlayerSessionData, assetId: AssetTickerDto): Promise<AssetDetailDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/market/asset/${assetId.assetTicker}`;
        return this.httpService.executeGetRequest(url, AssetDetailDto);
    }

    async getAssetAnalysis(sessionData: PlayerSessionData, assetId: AssetTickerDto): Promise<AssetStatisticalAnalysisDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/market/analysis/${assetId.assetTicker}`;
        return this.httpService.executeGetRequest(url, AssetStatisticalAnalysisDto);
    }

    constructor(httpService: HttpService = new HttpService()) {
        this.httpService = httpService;
        this.baseServiceUrl = `${process.env.BASE_SERVER_URL}${process.env.MARKET_ANALYSIS_SERVICE_PREFIX}`
    }
}