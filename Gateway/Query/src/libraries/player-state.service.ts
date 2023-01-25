import {HttpService} from "./http.service";
import {PlayerSessionData} from "../interfaces/session-data.interface";
import {PortfolioDto} from "../dto/portfolio.dto";
import {BankAcountDto} from "../dto/bank-acount.dto";

export class PlayerStateService {
    readonly httpService: HttpService
    readonly baseServiceUrl: string

    async getPortfolio(sessionData: PlayerSessionData): Promise<PortfolioDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/player/${sessionData.playerId}/portfolio`;
        return this.httpService.executeGetRequest<PortfolioDto>(url, PortfolioDto)
    }

    async getBankAccount(sessionData: PlayerSessionData): Promise<BankAcountDto> {
        const url = `${this.baseServiceUrl}/${sessionData.gameIdInEngine}/player/${sessionData.playerId}/bank-account`;
        return this.httpService.executeGetRequest<BankAcountDto>(url, BankAcountDto)
    }


    constructor(httpService: HttpService = new HttpService()) {
        this.httpService = httpService;
        this.baseServiceUrl = `${process.env.BASE_SERVER_URL}${process.env.PLAYER_STATE_SERVICE_PREFIX}`
    }
}