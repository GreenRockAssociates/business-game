import {MarketAnalysisService} from "../../../libraries/market-analysis.service";
import {MarketResponseDto} from "../../../dto/market-response.dto";
import {NextFunction, Request, Response} from "express";
import {AxiosError} from "axios";

export function getMarketRateRouteFactory(marketAnalysisService: MarketAnalysisService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now()
        try {
            const market: MarketResponseDto = await marketAnalysisService.getMarketRate(req.session);
            res.json(market);
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e?.response?.status ?? 500)
            } else {
                next(e)
            }
        }
    }
}