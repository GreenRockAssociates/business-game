import {MarketAnalysisService} from "../../../libraries/market-analysis.service";
import {NextFunction, Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";
import {AssetTickerDto} from "../../../dto/asset-ticker.dto";
import {AssetStatisticalAnalysisDto} from "../../../dto/asset-statistical-analysis.dto";

export function getAssetAnalysisRouteFactory(marketAnalysisService: MarketAnalysisService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const assetId: AssetTickerDto = req.params as unknown as AssetTickerDto;

        try {
            const assetStatisticalAnalysisDto: AssetStatisticalAnalysisDto = await marketAnalysisService.getAssetAnalysis(req.session, assetId);
            res.json(instanceToPlain(assetStatisticalAnalysisDto));
        } catch (e: any) {
            if (e instanceof AxiosError){
                res.sendStatus(e?.response?.status ?? 500)
            } else {
                next(e)
            }
        }
    }
}