import {Request, Response} from 'express';
import {SessionDataResponseDto} from "../../dto/session-data-response.dto";
import {instanceToPlain, plainToInstance} from 'class-transformer';
import {validateOrReject} from "class-validator";

export async function sessionData(req: Request, res: Response) {
    try {
        const responseDto = plainToInstance(SessionDataResponseDto, req.session.data, {excludeExtraneousValues: true});
        await validateOrReject(responseDto);

        res.status(200);
        res.send(JSON.stringify(instanceToPlain(responseDto)));
    } catch (e){
        res.sendStatus(401);
    }
}