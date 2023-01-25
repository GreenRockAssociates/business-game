import {Request, Response} from "express";
import {Repository} from "typeorm";
import {GameEntity, GameState} from "../../entities/game.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {EngineIdDto} from "../../dto/engine-id.dto";

export async function gameIdToEngineId(req: Request, res: Response, gameRepository: Repository<GameEntity>){
    const userId = req.session.userId;
    const gameDto: GameIdDto = req.params as unknown as GameIdDto;

    const gameEntity: GameEntity = await gameRepository.findOne({
        relations: {
            invitations: true,
        },
        where : [
            {id: gameDto.gameId, ownerId: userId},                                              // The specified game if the user is its owner
            {id: gameDto.gameId, invitations: {userId: userId, acceptedInvitation: true}}       // Or the specified game if the user is one of its player
        ]
    })

    if (!gameEntity){
        res.statusMessage = "No game found"
        res.sendStatus(404);
        return;
    }

    if (!gameEntity.engineId || gameEntity.gameState === GameState.CREATED){
        res.statusMessage = "Game hasn't started yet"
        res.sendStatus(412);
        return;
    }

    res.json(new EngineIdDto(gameEntity.engineId));
}