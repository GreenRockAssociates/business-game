import {MarketAnalysisService} from "../../../libraries/market-analysis.service";
import {Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";
import {AssetTickerDto} from "../../../dto/asset-ticker.dto";
import {AssetStatisticalAnalysisDto} from "../../../dto/asset-statistical-analysis.dto";

export function getAssetAnalysisRouteFactory(marketAnalysisService: MarketAnalysisService) {
    return async (req: Request, res: Response) => {
        const assetId: AssetTickerDto = req.params as unknown as AssetTickerDto;

        try {
            const assetStatisticalAnalysisDto: AssetStatisticalAnalysisDto = await marketAnalysisService.getAssetAnalysis(req.session, assetId);
            res.json(instanceToPlain(assetStatisticalAnalysisDto));
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e.response.status || 500);
            } else {
                res.sendStatus(500);
            }
        }
    }
}