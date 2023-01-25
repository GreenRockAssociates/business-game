import {AssetHealthService} from "../../../libraries/asset-health.service";
import {Request, Response} from "express";
import {NewsResponseDto} from "../../../dto/news-response.dto";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";

export function getAllNewsRouteFactory(assetHealthService: AssetHealthService){
    return async (req: Request, res: Response) => {
        try {
            const newsDto: NewsResponseDto = await assetHealthService.getAllNews(req.session);
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