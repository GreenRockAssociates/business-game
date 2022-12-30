import {Request, Response} from 'express';
import {instanceToPlain, plainToInstance} from 'class-transformer';
import {validateOrReject} from "class-validator";

export async function newgame(req: Request, res: Response) {
    try {


    } catch (e){
        res.sendStatus(401);
    }
}