import {MarketAnalysisService} from "../../../libraries/market-analysis.service";
import {MarketResponseDto} from "../../../dto/market-response.dto";
import {NextFunction, Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";

export function getMarketRateRouteFactory(marketAnalysisService: MarketAnalysisService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const market: MarketResponseDto = await marketAnalysisService.getMarketRate(req.session);
            res.json(instanceToPlain(market));
        } catch (e) {
            next(e)
        }
    }
}