import { Request, Response } from 'express';
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {AssetDto} from "../../dto/asset.dto";


export async function marketRate(req: Request, res: Response, marketEntityRepository : Repository<MarketEntity>) {

    const gameid = req.params as unknown as GameIdDto

    const assets = await marketEntityRepository.findOne({
        where : {
            gameId : gameid.gameID,
        },
        order : {
            tick : "DESC"
        },
        relations : {
            asset: true
        }
    })

    if(!assets){
        res.sendStatus(404)
        return
    }

    console.log(assets)

    //const jsonresponse = new AssetDto(assets)
    //res.json(jsonresponse)

    res.sendStatus(200);
}