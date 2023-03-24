import { Request, Response } from 'express';
import {Repository} from "typeorm";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {MarketEntryDto, MarketResponseDto} from "../../dto/market-response.dto";

export async function marketRate(req: Request, res: Response, marketEntityRepository : Repository<MarketEntity>) {
    const start = Date.now();
    const gameid = req.params as unknown as GameIdDto

    const assets = await marketEntityRepository.find({
        where : {
            gameId : gameid.gameID,
        },
    })

    if(assets.length === 0 || !assets){
        res.sendStatus(404)
        return
    }

    let list : MarketEntryDto[] = assets.map(item => new MarketEntryDto(item.assetTicker, item.tick, item.value, item.tradable));
    res.json(new MarketResponseDto(list))
}