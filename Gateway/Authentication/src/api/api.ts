import express, {Router} from 'express';
import {UserEntity} from "../entities/user.entity";
import {DataSource, Repository} from "typeorm";
import {RegisterUserDto} from "../dto/register-user.dto";
import {LoginDto} from "../dto/login.dto";

import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";
import {registerUser} from "./routes/register.route";
import {login} from "./routes/login.route";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const userRepository : Repository<UserEntity> = dataSource.getRepository(UserEntity.name);

    router.post('/register', jsonToDtoMiddlewareFactory(RegisterUserDto), (req, res) => registerUser(req, res, userRepository))
    router.post('/login', jsonToDtoMiddlewareFactory(LoginDto), (req, res) => login(req, res, userRepository))
}