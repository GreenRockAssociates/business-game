import express, {Request, Response, NextFunction, Router} from 'express';

import {LauncherService} from "../libraries/launcher.service";
import {resolvePlayerSession} from "./middlewares/resolve-player-session.middleware";
import {PlayerStateService} from "../libraries/player-state.service";
import {buyRouteFactory} from "./routes/player-state/buy.route";
import {sellRouteFactory} from "./routes/player-state/sell.route";
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {BuySellExternalRequestDto} from "../dto/buy-sell-external-request.dto";


export const router = express.Router()

export function registerRoutes(router: Router){
    const launcherService = new LauncherService();
    router.use("/:gameId", (req: Request, res: Response, next: NextFunction) => resolvePlayerSession(req, res, next, launcherService));

    const playerStateServie = new PlayerStateService();
    router.post(":gameId/player/buy", jsonToDtoMiddlewareFactory(BuySellExternalRequestDto), buyRouteFactory(playerStateServie))
    router.post(":gameId/player/sell", jsonToDtoMiddlewareFactory(BuySellExternalRequestDto), sellRouteFactory(playerStateServie))
}