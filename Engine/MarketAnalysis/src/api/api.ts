import express, {Request, Response, Router} from 'express';
//import {UserEntity} from "../entities/user.entity";
import {DataSource, Repository} from "typeorm";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {GameIdDto} from "../dto/game-id.dto";
import {marketRate} from "./routes/marketRate.route";
import {MarketEntity} from "../../../DataSource/src/entities/market.entity";
import {AssetEntity} from "../../../DataSource/src/entities/asset.entity";
import {assetRate} from "./routes/Asset.route";
import {GameAndAssetIdDto} from "../dto/gameandassetid.dto";

import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {AnalysisRoute} from "./routes/Analysis.route";

//import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";



export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const marketEntityRepository = dataSource.getRepository(MarketEntity);
    const assetEntityRepository = dataSource.getRepository(AssetEntity);

    router.get('/:gameID/market/market-rate', requestParamsToDtoMiddlewareFactory(GameIdDto),(req : Request,res : Response) => marketRate(req,res,marketEntityRepository))
    router.get('/:gameID/market/asset/:assetID', requestParamsToDtoMiddlewareFactory(GameAndAssetIdDto),(req : Request,res : Response) => assetRate(req,res,marketEntityRepository))
    router.get('/:gameID/market/analysis/:assetID', requestParamsToDtoMiddlewareFactory(GameAndAssetIdDto),(req : Request,res : Response) => AnalysisRoute(req,res,marketEntityRepository,assetEntityRepository))


}