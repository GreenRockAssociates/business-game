import express, {Request, Response, NextFunction, Router} from 'express';

import {LauncherService} from "../libraries/launcher.service";
import {resolvePlayerSession} from "./middlewares/resolve-player-session.middleware";
import {PlayerStateService} from "../libraries/player-state.service";
import {getPortfolioRouteFactory} from "./routes/player-state/get-portfolio.route";
import {getBankAccountRouteFactory} from "./routes/player-state/get-bank-account.route";


export const router = express.Router()

export function registerRoutes(router: Router){
    const launcherService = new LauncherService();
    router.use("/:gameId", (req: Request, res: Response, next: NextFunction) => resolvePlayerSession(req, res, next, launcherService));

    const playerStateServie = new PlayerStateService();
    router.get(":gameId/player/portfolio", getPortfolioRouteFactory(playerStateServie))
    router.get(":gameId/player/bank-account", getBankAccountRouteFactory(playerStateServie))
}