import {NextFunction, Request, Response} from "express";
import {PlayerStateService} from "../../../libraries/player-state.service";
import {AxiosError} from "axios";
import {BuySellInternalRequestDto} from "../../../dto/buy-sell-internal-request.dto";
import {BuySellExternalRequestDto} from "../../../dto/buy-sell-external-request.dto";
import {validateOrReject} from "class-validator";

export function sellRouteFactory(playerStateService: PlayerStateService){
    return async (req: Request, res: Response, next: NextFunction) => {
        const sellRequest: BuySellExternalRequestDto = req.body;
        const internalRequestBody = new BuySellInternalRequestDto(req.session.playerId, sellRequest.assetId, sellRequest.quantity);
        try {
            await validateOrReject(internalRequestBody);
        } catch (_){
            res.sendStatus(400);
            return;
        }

        try {
            await playerStateService.sell(req.session, internalRequestBody)
            res.sendStatus(200);
        } catch (e) {
            next(e)
        }
    }
}