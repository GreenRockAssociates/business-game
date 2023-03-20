import { Request, Response } from 'express';
import {BuyandsellDto} from "../../dto/buyandsell.dto";
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameIdDto} from "../../dto/game-id.dto";


export async function sell(req: Request, res: Response, repository_player: Repository<PlayerEntity>, marketEntityRepository : Repository<MarketEntity>,portfolioEntityRepository : Repository<PortfolioEntity>) {
    const dto = req.body as BuyandsellDto;
    const gameid = req.params as unknown as GameIdDto;


    const player = await repository_player.findOne({
        where: {
            id : dto.playerId,
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

    const playerasset = player.portfolio.find(asset => asset.assetTicker=== dto.assetId)

    if(!playerasset || playerasset.count< dto.quantity){
        res.sendStatus(412)
        return
    }

    if(playerasset.count===dto.quantity){
        player.portfolio = player.portfolio.filter(entry => entry.assetTicker !== dto.assetId);
        await portfolioEntityRepository.delete({playerId : dto.playerId, assetTicker : dto.assetId});
    }
    else{
        playerasset.count -= dto.quantity
        await portfolioEntityRepository.save(playerasset)
    }
    player.bankAccount += dto.quantity*asset.value
    await repository_player.save(player)


    res.sendStatus(200);
}