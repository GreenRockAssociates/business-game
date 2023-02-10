import {Request, Response} from "express";
import {Repository} from "typeorm";
import {UserIdTranslationEntity} from "../../entities/user-id-translation.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {EngineIdDto} from "../../dto/engine-id.dto";

export async function userIdToPlayerId(req: Request, res: Response, userIdTranslationRepository: Repository<UserIdTranslationEntity>) {
    const userId = req.session.userId;
    const gameIdDto: GameIdDto = req.params as unknown as GameIdDto;

    const translationEntity: UserIdTranslationEntity = await userIdTranslationRepository.findOneBy({
        userId,
        gameId: gameIdDto.gameId
    })

    if (!translationEntity) {
        res.statusMessage = "No translation for this user"
        res.sendStatus(404);
        return;
    }

    const response = new EngineIdDto(translationEntity.enginePlayerId);
    res.json(response);
}