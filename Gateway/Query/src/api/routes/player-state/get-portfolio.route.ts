import {PlayerStateService} from "../../../libraries/player-state.service";
import {Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";
import {PortfolioDto} from "../../../dto/portfolio.dto";

export function getPortfolioRouteFactory(playerStateService: PlayerStateService) {
    return async (req: Request, res: Response) => {
        try {
            const portfolio: PortfolioDto = await playerStateService.getPortfolio(req.session);
            res.json(instanceToPlain(portfolio));
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e.response.status || 500);
            } else {
                res.sendStatus(500);
            }
        }
    }
}