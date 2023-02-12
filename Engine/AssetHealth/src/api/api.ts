import express, {Router} from 'express';
import {DataSource, Repository} from "typeorm";
import {NewsReportEntity} from "../../../DataSource/src/entities/news-report.entity";
import {AssetEntity} from "../../../DataSource/src/entities/asset.entity";
import {GameEntity} from "../../../DataSource/src/entities/game.entity";
import {AssetHealthEntity} from "../../../DataSource/src/entities/asset-health.entity";
import {getAllNewsRouteFactory} from "./routes/get-all-news.route";
import {getAllNewsForAssetRouteFactory} from "./routes/get-all-news-for-asset.route";
import {getAssetHealthRouteFactory} from "./routes/get-asset-health.route";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {GameIdDto} from "../dto/game-id.dto";
import {GameIdAndAssetTickerDto} from "../dto/game-id-and-asset-ticker.dto";
import {parseNewsTemplateJson} from "../libraries/news-templates";
import * as fs from "fs";
import path from "path";
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {CurrentTickDto} from "../dto/current-tick.dto";
import {generateNewsRouteFactory} from "./routes/generate-news.route";
import {computeEvolutionVectorRouteFactory} from "./routes/compute-evolution-vector.route";
import {GameIdAndCurrentTickDto} from "../dto/game-id-and-current-tick.dto";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    // Read the news template file
    // Use readFileSync as this function is only called during the server bootstraping and therefore blocking the program doesn't matter
    const templateFileContent: string = fs.readFileSync(path.join(__dirname, '../../static/templateNewsList.json'), {encoding: 'utf-8'});
    const newsGenerators = parseNewsTemplateJson(templateFileContent);

    const newsReportRepository: Repository<NewsReportEntity> = dataSource.getRepository(NewsReportEntity);
    const assetRepository: Repository<AssetEntity> = dataSource.getRepository(AssetEntity);
    const gameRepository: Repository<GameEntity> = dataSource.getRepository(GameEntity);
    router.get("/:gameId/asset-health/news", requestParamsToDtoMiddlewareFactory(GameIdDto), getAllNewsRouteFactory(newsReportRepository));
    router.get("/:gameId/asset-health/news/:assetTicker", requestParamsToDtoMiddlewareFactory(GameIdAndAssetTickerDto), getAllNewsForAssetRouteFactory(newsReportRepository));
    router.post("/:gameId/asset-health/news", requestParamsToDtoMiddlewareFactory(GameIdDto), jsonToDtoMiddlewareFactory(CurrentTickDto), generateNewsRouteFactory(newsReportRepository, assetRepository, gameRepository, newsGenerators));

    const assetHealthRepository: Repository<AssetHealthEntity> = dataSource.getRepository(AssetHealthEntity);
    router.get("/:gameId/asset-health/health/:assetTicker", requestParamsToDtoMiddlewareFactory(GameIdAndAssetTickerDto), getAssetHealthRouteFactory(assetHealthRepository));
    router.post("/:gameId/asset-health/health", requestParamsToDtoMiddlewareFactory(GameIdDto), jsonToDtoMiddlewareFactory(CurrentTickDto), getAssetHealthRouteFactory(assetHealthRepository));
    router.post("/:gameId/asset-health/evolution-vector/:currentTick", requestParamsToDtoMiddlewareFactory(GameIdAndCurrentTickDto), computeEvolutionVectorRouteFactory(assetRepository, assetHealthRepository, newsReportRepository));
}