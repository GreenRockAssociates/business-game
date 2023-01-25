import {AssetHealthService} from "../../../libraries/asset-health.service";
import {Request, Response} from "express";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";
import {AssetTickerDto} from "../../../dto/asset-ticker.dto";
import {AssetHealthResponseDto} from "../../../dto/asset-health-response.dto";

export function getAssetHealthDataRoute(assetHealthService: AssetHealthService){
    return async (req: Request, res: Response) => {
        const assetId: AssetTickerDto = req.params as unknown as AssetTickerDto;

        try {
            const newsDto: AssetHealthResponseDto = await assetHealthService.getAssetHealthData(req.session, assetId);
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