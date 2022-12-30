import express, {Router} from 'express';
//import {UserEntity} from "../entities/user.entity";
import {DataSource, Repository} from "typeorm";

import {TempDto} from "../dto/temp.dto";

//import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";



export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){


}