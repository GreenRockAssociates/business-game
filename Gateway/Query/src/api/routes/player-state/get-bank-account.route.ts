import {PlayerStateService} from "../../../libraries/player-state.service";
import {Request, Response} from "express";
import {BankAcountDto} from "../../../dto/bank-acount.dto";
import {instanceToPlain} from "class-transformer";
import {AxiosError} from "axios";

export function getBankAccountRouteFactory(playerStateService: PlayerStateService) {
    return async (req: Request, res: Response) => {
        try {
            const bankAcount: BankAcountDto = await playerStateService.getBankAccount(req.session);
            res.json(instanceToPlain(bankAcount));
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e.response.status || 500);
            } else {
                res.sendStatus(500);
            }
        }
    }
}