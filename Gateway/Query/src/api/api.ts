import express, {Request, Response, NextFunction, Router} from 'express';

import {requestBodyToDtoMiddlewareFactory} from "./middlewares/request-body-to-dto.middleware";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {LauncherService} from "../libraries/launcher.service";
import {resolvePlayerSession} from "./middlewares/resolve-player-session.middleware";


export const router = express.Router()

export function registerRoutes(router: Router){
    const launcherService = new LauncherService();
    router.use("/:gameId", (req: Request, res: Response, next: NextFunction) => resolvePlayerSession(req, res, next, launcherService));
}