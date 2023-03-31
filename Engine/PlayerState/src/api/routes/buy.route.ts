import { Request, Response } from 'express';
import {BuyandsellDto} from "../../dto/buyandsell.dto";
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameIdDto} from "../../dto/game-id.dto";


export async function buy(req: Request, res: Response, repository_player: Repository<PlayerEntity>, portfolioEntityRepository: Repository<PortfolioEntity>, marketEntityRepository : Repository<MarketEntity>) {
    const dto = req.body as BuyandsellDto;
    const gameid = req.params as unknown as GameIdDto;


    const player = await repository_player.findOne({
        where: {
            id : dto.playerId
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


    let playerasset = await portfolioEntityRepository.findOneBy({
        playerId: dto.playerId,
        assetTicker: dto.assetId
    })

    if(playerasset){
        playerasset.count += dto.quantity
    }else{
        playerasset = new PortfolioEntity();
        playerasset.player = player;
        playerasset.asset = asset.asset;
        playerasset.count = dto.quantity
    }
    player.bankAccount -= dto.quantity*asset.value

    await portfolioEntityRepository.save(playerasset);
    await repository_player.save(player);

    res.sendStatus(200);
}