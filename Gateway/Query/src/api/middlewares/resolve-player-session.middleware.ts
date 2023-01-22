import {Request, Response, NextFunction} from "express";
import {LauncherService} from "../../libraries/launcher.service";
import {GameIdDto} from "../../dto/game-id.dto";
import {validateOrReject} from "class-validator";
import {AxiosError} from "axios";

/**
 * Fetches the player id and game id from the launcher service, and populates req.session with the response
 *
 * It relies on the launcher service to check that the user is properly authenticated. Indeed, if they aren't, the launcher
 * service should refuse to translate their user id to a player id
 *
 * If an error response is returned, this middleware ends the call chain
 * @param req
 * @param res
 * @param next
 * @param launcherService
 */
export async function resolvePlayerSession(req: Request, res: Response, next: NextFunction, launcherService: LauncherService) {
    const headers = req.headers;
    const gameIdFromParams = req.params["gameId"];
    const gameIdDto = new GameIdDto(gameIdFromParams);
    try {
        await validateOrReject(gameIdDto);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    try {
        const [gameIdInEngine, playerId] = await Promise.all([
            launcherService.translateGameIdToEngineId(gameIdDto.gameId, headers),
            launcherService.translateUserIdToPlayerIdForGame(gameIdDto.gameId, headers)
        ])

        req.session = {
            gameIdInEngine,
            playerId
        }
    } catch (e) {
        // Echo error from launcher service
        const status = (e as AxiosError).response.status;
        if (status === 404 || status === 412){
            res.statusMessage = (e as AxiosError).response.statusText;
        }
        res.sendStatus(status ?? 400);
        return;
    }

    // Only called if no error occurs during fetching
    next();
}