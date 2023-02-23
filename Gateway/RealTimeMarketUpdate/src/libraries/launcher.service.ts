import axios, {AxiosInstance} from "axios";
import {IncomingHttpHeaders} from "http";
import {ClassConstructor, plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";
import {GameIdInEngineInternalResponseDto} from "../dto/game-id-in-engine-internal-response.dto";

export class LauncherService {
    axios: AxiosInstance

    async translateGameIdToEngineId(gameId: string, headers: IncomingHttpHeaders): Promise<string> {
        const requestUrl = `${process.env.BASE_SERVER_URL}${process.env.LAUNCHER_SERVICE_PREFIX}/games/${gameId}/engine-id`
        const rawResponse = await this.executeGetRequest(requestUrl, headers);
        const validatedResponse = await this.castAndValidateResponse(rawResponse, GameIdInEngineInternalResponseDto);

        return validatedResponse.engineId;
    }

    private async executeGetRequest(url: string, headers: IncomingHttpHeaders): Promise<object> {
        // Echo only the request's cookie
        // We don't need the 'x-xsrf-token' header since we do a GET request
        const cookieHeaders = {cookie: headers.cookie}
        let {data} = await this.axios.get(url, {
            headers: cookieHeaders
        })

        return data;
    }

    private async castAndValidateResponse<T extends object>(response: object, dtoType: ClassConstructor<T>): Promise<T>{
        const castResponse: T = plainToInstance(dtoType, response, {excludeExtraneousValues: true});
        await validateOrReject(castResponse);

        return castResponse;
    }

    constructor(axiosInstance: AxiosInstance = axios.create()) {
        this.axios = axiosInstance;
    }
}