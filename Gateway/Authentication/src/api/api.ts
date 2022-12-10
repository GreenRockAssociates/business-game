import express, {Router} from 'express';
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {UserEntity} from "../entities/user.entity";
import {registerUser} from "./routes/register.route";
import {DataSource} from "typeorm";
import {RegisterUserDto} from "../dto/register-user.dto";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    router.post('/register', jsonToDtoMiddlewareFactory(RegisterUserDto), (req, res) => registerUser(req, res, dataSource.getRepository(UserEntity.name)))
}