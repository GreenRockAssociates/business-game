import {UserSessionData} from "../interfaces/session-data.interface";
import axios, {AxiosInstance} from 'axios';
import {SessionDataResponseDto} from "../dto/session-data-response.dto";
import {IncomingHttpHeaders} from "http";
import {validateOrReject} from "class-validator";
import "reflect-metadata";
import {plainToInstance} from "class-transformer";
import {UserEmailDto} from "../dto/user-email.dto";

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
        // Echo only the request's cookie
        // We don't need the 'x-xsrf-token' header since we do a GET request
        const cookieHeaders = {cookie: headers.cookie}
        let {data} = await this.axios.get(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/session-data`, {
            headers: cookieHeaders
        })

        // We need to cast 'data' to an actual class instance, as Axios only returns a plain object
        data = plainToInstance(SessionDataResponseDto, data, {excludeExtraneousValues: true})
        await validateOrReject(data)

        // Cast dto to the right interface
        return {
            userId: data.userId
        }
    }

    async getUserEmail(userId: string, headers: IncomingHttpHeaders): Promise<UserEmailDto> {
        // Echo only the request's cookie
        // We don't need the 'x-xsrf-token' header since we do a GET request
        const cookieHeaders = {cookie: headers.cookie}
        let {data} = await this.axios.get(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/userEmail?userId=${userId}`, {
            headers: cookieHeaders
        })

        // We need to cast 'data' to an actual class instance, as Axios only returns a plain object
        const dto: UserEmailDto = plainToInstance(UserEmailDto, data as object, {excludeExtraneousValues: true})
        await validateOrReject(dto)

        // Cast dto to the right interface
        return dto
    }

    constructor(instance: AxiosInstance = axios.create()) {
        this.axios = instance;
    }
}