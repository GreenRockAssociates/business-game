import express, {Router} from 'express';
import {DataSource} from "typeorm";
import {PlayerEntity} from "../../../DataSource/src/entities/player.entity";
import {GameEntity} from "../../../DataSource/src/entities/game.entity";
import {NewGameDto} from "../dto/new-game.dto";
import {newgame} from "./routes/new-game.route";
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";


export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const playerEntityRepository = dataSource.getRepository(PlayerEntity);
    const gameEntityRepository = dataSource.getRepository(GameEntity);

    router.post('/orchestrator/new-game', jsonToDtoMiddlewareFactory(NewGameDto), (req, res) => newgame(req, res, playerEntityRepository, gameEntityRepository))
}