import axios from "axios";
import express, {Router} from 'express';

import {requestBodyToDtoMiddlewareFactory} from "./middlewares/request-body-to-dto.middleware";
import {requestParamsToDtoMiddlewareFactory} from "./middlewares/request-params-to-dto.middleware";


export const router = express.Router()

export function registerRoutes(router: Router){
}