import {HttpService} from "./http.service";
import {PlayerSessionData} from "../interfaces/session-data.interface";
import {BuySellInternalRequestDto} from "../dto/buy-sell-internal-request.dto";

export class PlayerStateService {
    readonly httpService: HttpService
    readonly baseServiceUrl: string

    async buy(sessionData: PlayerSessionData, body: BuySellInternalRequestDto): Promise<number> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/player/buy`;
        return this.httpService.executePostRequest(url, body);
    }

    async sell(sessionData: PlayerSessionData, body: BuySellInternalRequestDto): Promise<number> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/player/sell`;
        return this.httpService.executePostRequest(url, body);
    }

    constructor(httpService: HttpService = new HttpService()) {
        this.httpService = httpService;
        this.baseServiceUrl = `${process.env.BASE_SERVER_URL}${process.env.PLAYER_STATE_SERVICE_PREFIX}`
    }
}