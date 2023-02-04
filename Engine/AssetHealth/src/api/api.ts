import express, {Router} from 'express';
import {DataSource, Repository} from "typeorm";
import {NewsReportEntity} from "../../../DataSource/src/entities/news-report.entity";
import {AssetHealthEntity} from "../../../DataSource/src/entities/asset-health.entity";
import {getAllNewsRouteFactory} from "./routes/get-all-news.route";
import {getAllNewsForAssetRouteFactory} from "./routes/get-all-news-for-asset.route";
import {getAssetHealthRouteFactory} from "./routes/get-asset-health.route";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {GameIdDto} from "../dto/game-id.dto";
import {GameIdAndAssetTickerDto} from "../dto/game-id-and-asset-ticker.dto";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const newsReportRepository: Repository<NewsReportEntity> = dataSource.getRepository(NewsReportEntity);
    router.get("/:gameId/asset-health/news", requestParamsToDtoMiddlewareFactory(GameIdDto), getAllNewsRouteFactory(newsReportRepository));
    router.get("/:gameId/asset-health/news/:assetTicker", requestParamsToDtoMiddlewareFactory(GameIdAndAssetTickerDto), getAllNewsForAssetRouteFactory(newsReportRepository));

    const assetHealthRepository: Repository<AssetHealthEntity> = dataSource.getRepository(AssetHealthEntity);
    router.get("/:gameId/asset-health/health/:assetTicker", requestParamsToDtoMiddlewareFactory(GameIdAndAssetTickerDto), getAssetHealthRouteFactory(assetHealthRepository));
}