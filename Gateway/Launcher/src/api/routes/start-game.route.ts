import {Request, Response} from "express";
import {Repository} from "typeorm";
import {GameEntity, GameState} from "../../entities/game.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {UserIdTranslationEntity} from "../../entities/user-id-translation.entity";
import {InvitationEntity} from "../../entities/invitation.entity";
import {GameOrchestratorService} from "../../libraries/game-orchestrator.service";

function getParticipatingUsers(game: GameEntity){
    const keepAcceptedInvitations = (invitation: InvitationEntity) => invitation.acceptedInvitation;
    const invitationToUserId = (invitation: InvitationEntity) => invitation.userId;

    const participatingUserIds = game.invitations.filter(keepAcceptedInvitations).map(invitationToUserId);
    participatingUserIds.push(game.ownerId);

    return participatingUserIds;
}

function createUserIdToPlayerIdTranslationsEntities(userIds: string[], playerIds: string[]): UserIdTranslationEntity[] {
    return userIds.map((userId: string, index: number) => new UserIdTranslationEntity(userId, playerIds[index]))
}

export async function startGame(req: Request, res: Response, gameRepository: Repository<GameEntity>, gameOrchestratorService: GameOrchestratorService){
    const userId = req.session.userId;
    const gameIdDto: GameIdDto = req.params as unknown as GameIdDto;

    const game: GameEntity = await gameRepository.findOne({
        where: {
            id: gameIdDto.gameId,
            ownerId: userId
        },
        relations: {
            invitations: true,
            userIds: true
        }
    })

    if (!game) {
        res.sendStatus(404);
        return;
    }

    if (game.gameState !== GameState.CREATED) {
        // If the game has already started or ended, do nothing
        res.sendStatus(200);
        return;
    }

    const participatingUserIds = getParticipatingUsers(game);

    const {playerIds, gameEngineId} = await gameOrchestratorService.startGame(participatingUserIds.length);

    game.gameState = GameState.STARTED;
    game.engineId = gameEngineId;
    game.userIds = createUserIdToPlayerIdTranslationsEntities(participatingUserIds, playerIds);

    await gameRepository.save(game);

    res.sendStatus(200);
}