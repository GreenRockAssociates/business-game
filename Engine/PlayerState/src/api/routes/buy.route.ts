import { Request, Response } from 'express';
import {BuyandsellDto} from "../../dto/buyandsell.dto";
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameIdDto} from "../../dto/game-id.dto";


export async function buy(req: Request, res: Response, repository_player: Repository<PlayerEntity>, marketEntityRepository : Repository<MarketEntity>) {
    const dto = req.body as BuyandsellDto;
    const gameid = req.params as unknown as GameIdDto;


    const player = await repository_player.findOne({
        where: {
            id : dto.playerId
        },
        relations: {
            portfolio : true
        }
    })
    if(!player){
        res.sendStatus(404)
        return
    }
    const asset = await marketEntityRepository.findOne({
        where : {
            gameId : gameid.gameID,
            assetTicker : dto.assetId,
        },
        order : {
            tick : "DESC"
        },
        relations : {
            asset: true
        }
    })
    if(!asset){
        res.sendStatus(404)
        return
    }
    if ( player.bankAccount < asset.value * dto.quantity){
        res.sendStatus(412)
        return
    }
    const playerasset = player.portfolio.find(asset => asset.assetTicker=== dto.assetId)

    if(playerasset){
        playerasset.count += dto.quantity
    }else{
        const newPlayerAsset = new PortfolioEntity();
        newPlayerAsset.player = player;
        newPlayerAsset.asset = asset.asset;
        newPlayerAsset.count = dto.quantity
        player.portfolio.push(newPlayerAsset)
    }
    player.bankAccount -= dto.quantity*asset.value
    await repository_player.save(player)

    res.sendStatus(200);
}