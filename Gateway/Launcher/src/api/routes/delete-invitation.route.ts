import {Repository} from "typeorm";
import {InvitationEntity} from "../../entities/invitation.entity";
import {Request, Response} from "express";
import {GameState} from "../../entities/game.entity";
import {InvitationIdentifierDto} from "../../dto/invitation-identifier.dto";

export async function deleteInvitation(req: Request, res: Response, invitationRepository: Repository<InvitationEntity>) {
    // @ts-ignore
    const userId = req.session.userId;
    const {gameId, invitedUserId}: InvitationIdentifierDto = req.params as unknown as InvitationIdentifierDto;

    const invitation: InvitationEntity = await invitationRepository.findOne({
        where: {
            game: {
                id: gameId,
                ownerId: userId
            },
            userId: invitedUserId
        },
        relations: {
            game: true
        }
    })

    if (!invitation){
        res.sendStatus(404);
        return;
    }

    if (invitation.game.gameState !== GameState.CREATED){
        res.sendStatus(412);
        return;
    }

    await invitationRepository.remove(invitation);
    res.sendStatus(200);
}