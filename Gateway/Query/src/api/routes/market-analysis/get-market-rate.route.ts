import {MarketAnalysisService} from "../../../libraries/market-analysis.service";
import {MarketResponseDto} from "../../../dto/market-response.dto";
import {Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";

export function getMarketRateRouteFactory(marketAnalysisService: MarketAnalysisService) {
    return async (req: Request, res: Response) => {
        try {
            const market: MarketResponseDto = await marketAnalysisService.getMarketRate(req.session);
            res.json(instanceToPlain(market));
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e.response.status || 500);
            } else {
                res.sendStatus(500);
            }
        }
    }
}