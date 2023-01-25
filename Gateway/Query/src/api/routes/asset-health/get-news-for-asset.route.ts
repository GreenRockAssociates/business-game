import {AssetHealthService} from "../../../libraries/asset-health.service";
import {Request, Response} from "express";
import {NewsResponseDto} from "../../../dto/news-response.dto";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";
import {AssetTickerDto} from "../../../dto/asset-ticker.dto";

export function getNewsForAssetRouteFactory(assetHealthService: AssetHealthService){
    return async (req: Request, res: Response) => {
        const assetId: AssetTickerDto = req.params as unknown as AssetTickerDto;

        try {
            const newsDto: NewsResponseDto = await assetHealthService.getNewsForAsset(req.session, assetId);
            res.json(instanceToPlain(newsDto));
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e.response.status || 500);
            } else {
                res.sendStatus(500);
            }
        }
    }
}