import {NextFunction, Request, Response} from "express";
import {Repository} from "typeorm";
import {GameEntity} from "../../entities/game.entity";
import {instanceToPlain, plainToInstance} from "class-transformer";
import {GameResponseDto} from "../../dto/game-response.dto";
import {validateOrReject} from "class-validator";
import {InvitationEntity} from "../../entities/invitation.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {AuthenticationService} from "../../libraries/authentication.service";

export async function getGame(req: Request, res: Response, next: NextFunction, repository: Repository<GameEntity>, authenticationService: AuthenticationService) {
    try {
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
            && !game.invitations.find((invitation: InvitationEntity) => {
                return invitation.userId == userId
            })) {
            res.sendStatus(404);
            return;
        }

        // Add each user's email to the invitations list
        const gamePlain = instanceToPlain(game);
        await Promise.all(
            game.invitations.map(async (invitation, index) => {
                gamePlain['invitations'][index]['userEmail'] = await authenticationService.getUserEmail(invitation.userId, req.headers);
            })
        )

        const dto = plainToInstance(GameResponseDto, gamePlain, {
            excludeExtraneousValues: true,
            exposeUnsetFields: false
        });
        await validateOrReject(dto);

        res.status(200);
        res.json(instanceToPlain(dto));
    } catch (e) {
      next(e)
    }
}