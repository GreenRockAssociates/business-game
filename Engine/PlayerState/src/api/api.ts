import express, {Request, Response, Router} from 'express';
import {DataSource} from "typeorm";
import {bankAcount} from "./routes/bank-account.route";
import {PlayerEntity} from "../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../DataSource/src/entities/portfolio.entity";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {IdsDto} from "../dto/ids.dto";
import {portfolio} from "./routes/portfolio.route";
import {GameIdDto} from "../dto/game-id.dto";
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {BuyandsellDto} from "../dto/buyandsell.dto";
import {buy} from "./routes/buy.route";
import {sell} from "./routes/sell.route";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const playerEntityRepository = dataSource.getRepository(PlayerEntity);
    const marketEntityRepository = dataSource.getRepository(MarketEntity);
    const portfolioEntityRepository = dataSource.getRepository(PortfolioEntity);

    router.get('/:gameID/player/:playerID/portfolio', requestParamsToDtoMiddlewareFactory(IdsDto), (req: Request, res: Response) => portfolio(req, res, playerEntityRepository));
    router.get('/:gameID/player/:playerID/bank-account', requestParamsToDtoMiddlewareFactory(IdsDto), (req: Request, res: Response) => bankAcount(req, res, playerEntityRepository));
    router.post('/:gameID/player/buy', requestParamsToDtoMiddlewareFactory(GameIdDto), jsonToDtoMiddlewareFactory(BuyandsellDto), (req: Request, res: Response) => buy(req, res, playerEntityRepository, portfolioEntityRepository, marketEntityRepository))
    router.post('/:gameID/player/sell', requestParamsToDtoMiddlewareFactory(GameIdDto), jsonToDtoMiddlewareFactory(BuyandsellDto), (req: Request, res: Response) => sell(req, res, playerEntityRepository, marketEntityRepository, portfolioEntityRepository))
}