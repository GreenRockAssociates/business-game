import {Request, Response} from 'express';
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {NewGameDto} from "../../dto/new-game.dto";
import {newgameResponseDto} from "../../dto/new-game-reponse.dto";

export async function newgame(req: Request, res: Response, repositoryPlayer : Repository<PlayerEntity>, repositoryGame : Repository<GameEntity>) {

    const dto = req.body as NewGameDto;
    if(dto.numberOfPlayers<= 0){
        res.sendStatus(412)
        return;

    }

    const newgame = new GameEntity()
    await repositoryGame.save(newgame)
    let temp = []
    for(let i =0; i< dto.numberOfPlayers;i ++){
        const newplayer = new PlayerEntity()
        newplayer.game = newgame;
        await repositoryPlayer.save(newplayer)
        temp.push(newplayer.id)

    }
    const jsonresponse = new newgameResponseDto(newgame.id,temp)
    res.json(jsonresponse)
    res.sendStatus(200)


}