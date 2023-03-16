import express, {Router} from 'express';
import {DataSource} from "typeorm";
import {PlayerEntity} from "../../../DataSource/src/entities/player.entity";
import {GameEntity} from "../../../DataSource/src/entities/game.entity";
import {NewGameDto} from "../dto/new-game.dto";
import {newGame} from "./routes/new-game.route";
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {RabbitMqInteractor} from "../message-broker/rabbit-mq-interactor";
import {AssetHealthService} from "../libraries/asset-health.service";
import { MarketEntity } from '../../../DataSource/src/entities/market.entity';
import { AssetEntity } from '../../../DataSource/src/entities/asset.entity';


export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource, rabbitMqInteractor: RabbitMqInteractor){
    const playerEntityRepository = dataSource.getRepository(PlayerEntity);
    const gameEntityRepository = dataSource.getRepository(GameEntity);
    const marketRepository = dataSource.getRepository(MarketEntity);
    const assetRepository = dataSource.getRepository(AssetEntity);

    const assetHealthService = new AssetHealthService();

    router.post('/orchestrator/new-game', jsonToDtoMiddlewareFactory(NewGameDto), (req, res) => newGame(req, res, playerEntityRepository, gameEntityRepository, marketRepository, assetRepository, rabbitMqInteractor, assetHealthService))
}