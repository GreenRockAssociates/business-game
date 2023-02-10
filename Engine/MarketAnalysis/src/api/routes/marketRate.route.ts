import { Request, Response } from 'express';
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {AssetDto} from "../../dto/asset.dto";
import {assetStateDto} from "../../dto/assetstate.dto";
import util from "util";


export async function marketRate(req: Request, res: Response, marketEntityRepository : Repository<MarketEntity>) {

    const gameid = req.params as unknown as GameIdDto

    const assets = await marketEntityRepository.find({
        where : {
            gameId : gameid.gameID,
        },
        order : {
            assetTicker : "DESC"
        },
        relations : {
            asset: true
        }
    })

    if(assets.length==0 || !assets){
        res.sendStatus(404)
        return
    }
    console.log('dfsgsd')

    let list = [];
    let test = "111";
    let test2 = -1;
    for (const elem of assets) {
        if(elem.assetTicker!=test){
            console.log('here1')

            list.push(new AssetDto(elem.gameId,elem.asset.name,elem.assetTicker,elem.asset.description,elem.asset.logo))
            test2++
            test = elem.assetTicker
        }

        list[test2].Assetvalues.push(new assetStateDto(elem.tick,elem.value,elem.tradable))

    }


   // console.log(util.inspect(list, false, null))

    res.json(list)

}