import express, {Router} from 'express';
import {DataSource, Repository} from "typeorm";

import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {guardAuthenticated} from "./middlewares/guard-authenticated.middleware";
import {guardUnauthenticated} from "./middlewares/guard-unauthenticated.middleware";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){

}