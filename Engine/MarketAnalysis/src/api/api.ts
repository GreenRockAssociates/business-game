import express, {NextFunction, Request, Response, Router} from 'express';
import {DataSource} from "typeorm";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {GameIdDto} from "../dto/game-id.dto";
import {marketRate} from "./routes/marketRate.route";
import {MarketEntity} from "../../../DataSource/src/entities/market.entity";
import {AssetEntity} from "../../../DataSource/src/entities/asset.entity";
import {assetRate} from "./routes/Asset.route";
import {GameAndAssetIdDto} from "../dto/gameandassetid.dto";

import {AnalysisRoute} from "./routes/Analysis.route";



export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const marketEntityRepository = dataSource.getRepository(MarketEntity);
    const assetEntityRepository = dataSource.getRepository(AssetEntity);

    router.get('/:gameID/market/market-rate', requestParamsToDtoMiddlewareFactory(GameIdDto),(req : Request,res : Response) => marketRate(req,res,marketEntityRepository))
    router.get('/:gameID/market/asset/:assetID', requestParamsToDtoMiddlewareFactory(GameAndAssetIdDto),(req : Request,res : Response) => assetRate(req,res,assetEntityRepository))
    router.get('/:gameID/market/analysis/:assetID', requestParamsToDtoMiddlewareFactory(GameAndAssetIdDto),(req : Request,res : Response, next: NextFunction) => AnalysisRoute(req,res, next, marketEntityRepository,assetEntityRepository))
}