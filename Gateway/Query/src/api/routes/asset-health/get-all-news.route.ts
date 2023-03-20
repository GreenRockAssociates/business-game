import {AssetHealthService} from "../../../libraries/asset-health.service";
import {NextFunction, Request, Response} from "express";
import {NewsResponseDto} from "../../../dto/news-response.dto";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";

export function getAllNewsRouteFactory(assetHealthService: AssetHealthService){
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newsDto: NewsResponseDto = await assetHealthService.getAllNews(req.session);
            res.json(instanceToPlain(newsDto));
        } catch (e) {
            next(e)
        }
    }
}