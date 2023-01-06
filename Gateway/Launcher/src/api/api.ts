import axios from "axios";
import express, {Router} from 'express';
import {DataSource, Repository} from "typeorm";
import {GameEntity} from "../entities/game.entity";

import {InvitationEntity} from "../entities/invitation.entity";
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";
import {GameIdDto} from "../dto/game-id.dto";
import {CreateGameRequestDto} from "../specs/dto/create-game-request.dto";
import {InvitePlayerRequestDto} from "../dto/invite-player-request.dto";

import {getAllGames} from "./routes/get-all-games.route";
import {getGame} from "./routes/get-game.route";
import {newGame} from "./routes/new-game.route";
import {invitePlayer} from "./routes/invite-player.route";


export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const gameRepository: Repository<GameEntity> = dataSource.getRepository(GameEntity)
    const invitationRepository: Repository<InvitationEntity> = dataSource.getRepository(InvitationEntity)

    router.get("/games", (req, res) => getAllGames(req, res, gameRepository))
    router.get("/games/:gameId", requestParamsToDtoMiddlewareFactory(GameIdDto), (req, res) => getGame(req, res, gameRepository))
    router.post("/new-game", jsonToDtoMiddlewareFactory(CreateGameRequestDto), (req, res) => newGame(req, res, gameRepository))
    router.put("/games/:gameId/invite", requestParamsToDtoMiddlewareFactory(GameIdDto), jsonToDtoMiddlewareFactory(InvitePlayerRequestDto), (req, res) => invitePlayer(req, res, invitationRepository, gameRepository, axios.create()))
}