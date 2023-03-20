import {PlayerStateService} from "../../../libraries/player-state.service";
import {NextFunction, Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";
import {PortfolioDto} from "../../../dto/portfolio.dto";

export function getPortfolioRouteFactory(playerStateService: PlayerStateService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const portfolio: PortfolioDto = await playerStateService.getPortfolio(req.session);
            res.json(instanceToPlain(portfolio));
        } catch (e) {
            next(e)
        }
    }
}