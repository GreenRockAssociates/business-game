import {IncomingMessage} from "http";
import WebSocket from "ws";
import {LauncherService} from "../../libraries/launcher.service";
import {GameIdDto} from "../../dto/game-id.dto";
import {validateOrReject} from "class-validator";
import { AxiosError } from "axios";
import {MarketConnectionRepository} from "../market-connection-repository";

class InvalidParamsError {}

async function resolveGameId(request: IncomingMessage, launcherService: LauncherService): Promise<string> {
    const headers = request.headers;
    const gameIdFromParams = request.url.split("/")[1];
    const gameIdDto = new GameIdDto(gameIdFromParams);
    try {
        await validateOrReject(gameIdDto);
    } catch (e) {
        throw new InvalidParamsError();
    }

    return launcherService.translateGameIdToEngineId(gameIdDto.gameId, headers);
}

function handleError(e: any, ws: WebSocket){
    if (e instanceof InvalidParamsError){
        ws.close(1002, "400 Invalid query params")
    } else if (e instanceof AxiosError){
        const status = (e as AxiosError)?.response?.status ?? 400;
        let statusMessage = "";
        if (status === 404 || status === 412){
            statusMessage = (e as AxiosError)?.response?.statusText ?? "";
        }

        ws.close(1002, `${status} ${statusMessage}`);
    } else {
        ws.close(1002);
    }
}

export function connectionRequestToSessionDataListenerFactory(launcherService: LauncherService, marketConnectionRepository: MarketConnectionRepository){
    return async (ws: WebSocket, request: IncomingMessage) => {
        try {
            const gameIdInEngine: string = await resolveGameId(request, launcherService);

            marketConnectionRepository.addConnectionToGame(gameIdInEngine, ws);
        } catch (e) {
            handleError(e, ws);
        }
    }
}