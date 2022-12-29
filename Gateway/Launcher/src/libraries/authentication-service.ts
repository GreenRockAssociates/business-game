import {UserSessionData} from "../interfaces/session-data.interface";
import axios, {AxiosInstance} from 'axios';
import {SessionDataResponseDto} from "../dto/session-data-response.dto";
import {IncomingHttpHeaders} from "http";
import {validateOrReject} from "class-validator";
import "reflect-metadata";
import {plainToInstance} from "class-transformer";

export class AuthenticationService {
    axios: AxiosInstance

    /**
     * Returns the current session data of the user.
     *
     * Fetches that data from the Authentication service. This function also validates the data before returning it.
     *
     * @throws If the request fails or the data is invalid
     */
    async getSessionData(headers: IncomingHttpHeaders): Promise<UserSessionData> {
        let {data} = await this.axios.get(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/session-data`, {
            headers: headers // Echo the request's headers (cookie, csrf token, etc)
        })

        // We need to cast 'data' to an actual class instance, as Axios only returns a plain object
        data = plainToInstance(SessionDataResponseDto, data, {excludeExtraneousValues: true})
        await validateOrReject(data)

        // Cast dto to the right interface
        return {
            userId: data.userId
        }
    }

    constructor(instance: AxiosInstance = axios.create()) {
        this.axios = instance;
    }
}