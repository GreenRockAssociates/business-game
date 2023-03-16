import express, {Router} from 'express';
import {UserEntity} from "../entities/user.entity";
import {DataSource, Repository} from "typeorm";

import {RegisterUserDto} from "../dto/register-user.dto";
import {LoginDto} from "../dto/login.dto";
import {ChangePasswordDto} from "../dto/change-password.dto";
import {jsonToDtoMiddlewareFactory} from "./middlewares/json-to-dto.middleware";

import {registerUser} from "./routes/register.route";
import {login} from "./routes/login.route";
import {disconnect} from "./routes/disconnect.route";
import {changePassword} from "./routes/change-password.route";
import {guardAuthenticated} from "./middlewares/guard-authenticated.middleware";
import {guardUnauthenticated} from "./middlewares/guard-unauthenticated.middleware";
import {sessionData} from "./routes/session-data.route";
import {emailToUserId} from "./routes/email-to-user-id.route";
import {userIdToEmail} from "./routes/user-id-to-email.route";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
    const userRepository : Repository<UserEntity> = dataSource.getRepository(UserEntity.name);

    router.post('/register', guardUnauthenticated, jsonToDtoMiddlewareFactory(RegisterUserDto), (req, res) => registerUser(req, res, userRepository));
    router.post('/login', guardUnauthenticated, jsonToDtoMiddlewareFactory(LoginDto), (req, res) => login(req, res, userRepository));
    router.post('/disconnect', disconnect);
    router.post('/change-password', guardAuthenticated, jsonToDtoMiddlewareFactory(ChangePasswordDto), (req, res) => changePassword(req, res, userRepository));
    router.get('/session-data', guardAuthenticated, sessionData);
    router.get('/userId', guardAuthenticated, (req, res) => emailToUserId(req, res, userRepository))
    router.get('/userEmail', guardAuthenticated, (req, res) => userIdToEmail(req, res, userRepository))
}