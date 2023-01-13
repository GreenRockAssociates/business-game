import {Request, Response} from "express";
import {Repository} from "typeorm";
import {GameEntity} from "../../entities/game.entity";
import {instanceToPlain, plainToInstance} from "class-transformer";
import {GameResponseDto} from "../../dto/game-response.dto";
import {validateOrReject} from "class-validator";
import {InvitationEntity} from "../../entities/invitation.entity";
import {GameIdDto} from "../../dto/game-id.dto";

export async function getGame(req: Request, res: Response, repository: Repository<GameEntity>) {
    const userId = req.session.userId // Can use it directly because the middleware ensures the data is valid

    // Able to cast since there was a call to requestParamsToDtoMiddleware earlier in the call chain
    const requestDTO: GameIdDto = req.params as unknown as GameIdDto

    const game: GameEntity = await repository.findOne({
        relations: {
            invitations: true
        },
        where: {
            id: requestDTO.gameId
        }
    });

    if (!game) {
        res.sendStatus(404);
        return;
    }

    // If the player is not the owner nor an invited player, don't return the game and pretend it doesn't exist
    if (game.ownerId !== userId
    && !game.invitations.find((invitation: InvitationEntity) => {return invitation.userId == userId})){
        res.sendStatus(404);
        return;
    }

    const dto = plainToInstance(GameResponseDto, game, {excludeExtraneousValues: true, exposeUnsetFields: false});
    try {
        await validateOrReject(dto);

        res.status(200);
        res.json(instanceToPlain(dto));
    } catch (_) {
        // Games should be in a correct state, so if a validation fails it means that something was wrong somewhere else on the server
        res.sendStatus(500);
    }
}