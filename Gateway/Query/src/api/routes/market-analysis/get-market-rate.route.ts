import {MarketAnalysisService} from "../../../libraries/market-analysis.service";
import {MarketResponseDto} from "../../../dto/market-response.dto";
import {NextFunction, Request, Response} from "express";
import {AxiosError} from "axios";

export function getMarketRateRouteFactory(marketAnalysisService: MarketAnalysisService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now()
        try {
            console.log("Before calling service :", (Date.now() - start) / 1000)
            const market: MarketResponseDto = await marketAnalysisService.getMarketRate(req.session);
            console.log("After calling service :", (Date.now() - start) / 1000)
            res.json(market);
            console.log("After sending response :", (Date.now() - start) / 1000)
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e?.response?.status ?? 500)
            } else {
                next(e)
            }
        }
    }
}