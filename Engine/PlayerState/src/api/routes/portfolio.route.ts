import { Request, Response } from 'express';
import {bankAccountDto} from "../../dto/bank-acount-response.dto";
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {IdsDto} from "../../dto/ids.dto";
import {allportfolioDto} from "../../dto/portfolio-reponse.dto";


export async function portfolio(req: Request, res: Response, repository_player: Repository<PlayerEntity>) {
    const IDs = req.params as unknown as IdsDto;

    const player = await repository_player.findOne({
        where: {
            id : IDs.playerID,
            game : { id : IDs.gameID}
        }, relations:{portfolio : true}
    })
    if(!player){
        res.sendStatus(404)
        return
    }


    //const portfolio = new allportfolioDto()

    res.sendStatus(200);
    res.send(JSON.stringify(player.portfolio));

}