import {MarketAnalysisService} from "../../../libraries/market-analysis.service";
import {NextFunction, Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";
import {AssetTickerDto} from "../../../dto/asset-ticker.dto";
import {AssetDetailDto} from "../../../dto/asset-detail.dto";

export function getAssetDetailRouteFactory(marketAnalysisService: MarketAnalysisService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const assetId: AssetTickerDto = req.params as unknown as AssetTickerDto;

        try {
            const assetDetail: AssetDetailDto = await marketAnalysisService.getAssetDetail(req.session, assetId);
            res.json(instanceToPlain(assetDetail));
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e?.response?.status ?? 500)
            } else {
                next(e)
            }
        }
    }
}