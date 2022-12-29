import express, {Router} from 'express';
import {DataSource, Repository} from "typeorm";

import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {GetGameDetailRequestDto} from "../dto/get-game-detail-request.dto";
import {getAllGames} from "./routes/get-all-games.route";
import {GameEntity} from "../entities/game.entity";
import {getGame} from "./routes/get-game.route";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const gameRepository: Repository<GameEntity> = dataSource.getRepository(GameEntity)

    router.get("/games", (req, res) => getAllGames(req, res, gameRepository))
    router.get("/games/:gameId", requestParamsToDtoMiddlewareFactory(GetGameDetailRequestDto), (req, res) => getGame(req, res, gameRepository))
}