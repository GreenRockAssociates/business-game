import {Request, Response} from 'express';

export function disconnect(req: Request, res: Response) {
    req.session.destroy((err) => {
        if (err){
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    })
}