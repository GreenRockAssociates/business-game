import express, {Router} from 'express';
import {DataSource, Repository} from "typeorm";

export const router = express.Router()

export function registerRoutes(router: Router, dataSource: DataSource){
}