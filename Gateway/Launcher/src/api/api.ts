import express, {Router} from 'express';
import {DataSource, Repository} from "typeorm";
import {GameEntity} from "../entities/game.entity";

import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {GameIdDto} from "../dto/game-id.dto";
import {CreateGameRequestDto} from "../specs/dto/create-game-request.dto";

import {getAllGames} from "./routes/get-all-games.route";
import {getGame} from "./routes/get-game.route";
import {newGame} from "./routes/new-game.route";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const gameRepository: Repository<GameEntity> = dataSource.getRepository(GameEntity)

    router.get("/games", (req, res) => getAllGames(req, res, gameRepository))
    router.get("/games/:gameId", requestParamsToDtoMiddlewareFactory(GameIdDto), (req, res) => getGame(req, res, gameRepository))
    router.post("/new-game", jsonToDtoMiddlewareFactory(CreateGameRequestDto), (req, res) => newGame(req, res, gameRepository))
}