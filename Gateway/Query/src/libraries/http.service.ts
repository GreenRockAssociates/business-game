import axios, {AxiosInstance} from "axios";
import {validateOrReject} from "class-validator";
import {ClassConstructor, instanceToPlain, plainToInstance} from "class-transformer";

export class HttpService {
    axios: AxiosInstance

    async executePostRequest(url: string, body: object): Promise<number> {
        const {status} = await this.axios.post(url, instanceToPlain(body))
        return status;
    }

    async executeGetRequestFast(url: string): Promise<any> {
        return (await this.axios.get(url)).data
    }

    async executeGetRequest<T extends object>(url: string, dtoType: ClassConstructor<T>): Promise<T> {
        const {data} = await this.axios.get(url)
        return await this.castAndValidateResponse<T>(data, dtoType);
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