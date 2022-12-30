import express, {Router} from 'express';
//import {UserEntity} from "../entities/user.entity";
import {DataSource, Repository} from "typeorm";

import {NewGameDto} from "../dto/new-game.dto";

//import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";

import {newgame} from "./routes/new-game.route";


export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){

    router.post('/new-game', NewGameDto, (req, res) => newgame(req, res));

}