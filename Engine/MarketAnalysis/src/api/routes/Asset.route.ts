import { Request, Response } from 'express';
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {AssetDto} from "../../dto/asset.dto";
import {assetStateDto} from "../../dto/assetstate.dto";
import util from "util";
import {GameAndAssetIdDto} from "../../dto/gameandassetid.dto";


export async function assetRate(req: Request, res: Response, marketEntityRepository : Repository<MarketEntity>) {

    const ids = req.params as unknown as GameAndAssetIdDto

    const assets = await marketEntityRepository.findOne({
        where : {
            gameId : ids.gameID,
            assetTicker :ids.assetID
        },
        order : {
            assetTicker : "DESC"
        },
        relations : {
            asset: true
        }
    })

    if(!assets){
        res.sendStatus(404)
        return
    }
    console.log('dfsgsd')

    let list = [];

    list.push(new AssetDto(assets.gameId,assets.asset.name,assets.assetTicker,assets.asset.description,assets.asset.logo))




    console.log(util.inspect(list, false, null))

    res.json(list)

}