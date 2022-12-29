import {Request, Response} from "express";
import {GameEntity, GameState} from "../../entities/game.entity";
import {Repository} from "typeorm";
import {CreateGameRequestDto} from "../../specs/dto/create-game-request.dto";

export async function newGame(req: Request, res: Response, repository: Repository<GameEntity>) {
    const requestDto = req.body as CreateGameRequestDto; // Can cast body to CreateGameRequestDto since the middleware did the conversion
    const userId = req.session.userId;

    const newGame = new GameEntity(undefined, userId, GameState.CREATED, requestDto.name);

    try {
        await repository.save(newGame)
        res.sendStatus(200)
    } catch (_) {
        res.sendStatus(500)
    }
}