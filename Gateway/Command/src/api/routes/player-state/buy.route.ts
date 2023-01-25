import {Request, Response} from "express";
import {PlayerStateService} from "../../../libraries/player-state.service";
import {AxiosError} from "axios";
import {BuySellInternalRequestDto} from "../../../dto/buy-sell-internal-request.dto";
import {BuySellExternalRequestDto} from "../../../dto/buy-sell-external-request.dto";
import {validateOrReject} from "class-validator";

export function buyRouteFactory(playerStateService: PlayerStateService){
    return async (req: Request, res: Response) => {
        const buyRequest: BuySellExternalRequestDto = req.body;
        const internalRequestBody = new BuySellInternalRequestDto(req.session.playerId, buyRequest.assetId, buyRequest.quantity);
        try {
            await validateOrReject(internalRequestBody);
        } catch (_){
            res.sendStatus(400);
            return;
        }

        try {
            await playerStateService.buy(req.session, internalRequestBody)
            res.sendStatus(200);
        } catch (e) {
            if (e instanceof AxiosError){
                res.sendStatus(e.response.status || 500);
            } else {
                res.sendStatus(500);
            }
        }
    }
}