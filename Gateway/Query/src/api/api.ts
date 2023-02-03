import express, {Request, Response, NextFunction, Router} from 'express';

import {LauncherService} from "../libraries/launcher.service";
import {resolvePlayerSession} from "./middlewares/resolve-player-session.middleware";
import {PlayerStateService} from "../libraries/player-state.service";
import {getPortfolioRouteFactory} from "./routes/player-state/get-portfolio.route";
import {getBankAccountRouteFactory} from "./routes/player-state/get-bank-account.route";
import {MarketAnalysisService} from "../libraries/market-analysis.service";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {AssetTickerDto} from "../dto/asset-ticker.dto";
import {getAssetDetailRouteFactory} from "./routes/market-analysis/get-asset-detail.route";
import {getAssetAnalysisRouteFactory} from "./routes/market-analysis/get-asset-analysis.route";
import {getMarketRateRouteFactory} from "./routes/market-analysis/get-market-rate.route";
import {AssetHealthService} from "../libraries/asset-health.service";
import {getAllNewsRouteFactory} from "./routes/asset-health/get-all-news.route";
import {getNewsForAssetRouteFactory} from "./routes/asset-health/get-news-for-asset.route";
import {getAssetHealthDataRoute} from "./routes/asset-health/get-asset-health-data.route";


export const router = express.Router()

export function registerRoutes(router: Router){
    const launcherService = new LauncherService();
    router.use("/:gameId", (req: Request, res: Response, next: NextFunction) => resolvePlayerSession(req, res, next, launcherService));

    const playerStateServie = new PlayerStateService();
    router.get(":gameId/player/portfolio", getPortfolioRouteFactory(playerStateServie))
    router.get(":gameId/player/bank-account", getBankAccountRouteFactory(playerStateServie))

    const marketAnalysisService = new MarketAnalysisService();
    router.get(":gameId/market/market-rate", getMarketRateRouteFactory(marketAnalysisService));
    router.get(":gameId/market/asset/:assetTicker", requestParamsToDtoMiddlewareFactory(AssetTickerDto), getAssetDetailRouteFactory(marketAnalysisService));
    router.get(":gameId/market/analysis/:assetTicker", requestParamsToDtoMiddlewareFactory(AssetTickerDto), getAssetAnalysisRouteFactory(marketAnalysisService));

    const assetHealthService = new AssetHealthService();
    router.get(":gameId/asset-health/news", getAllNewsRouteFactory(assetHealthService))
    router.get(":gameId/asset-health/news/:assetTicker", requestParamsToDtoMiddlewareFactory(AssetTickerDto), getNewsForAssetRouteFactory(assetHealthService))
    router.get(":gameId/asset-health/health/:assetTicker", requestParamsToDtoMiddlewareFactory(AssetTickerDto), getAssetHealthDataRoute(assetHealthService))
}