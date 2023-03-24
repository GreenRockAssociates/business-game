import {InvitationEntity} from "../../entities/invitation.entity";
import {Repository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {AnswerInviteDto} from "../../dto/answer-invite.dto";
import {GameState} from "../../entities/game.entity";

export async function answerInvite(req: Request, res: Response, next: NextFunction, invitationRepository: Repository<InvitationEntity>){
    try {
        const userId = req.session.userId;
        const answerDto = req.body as AnswerInviteDto;

        const invitation: InvitationEntity = await invitationRepository.findOne({
            where: {
                userId,
                gameId: answerDto.gameId,
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

        invitation.acceptedInvitation = answerDto.accept || invitation.acceptedInvitation; // Idempotence : if the invitation was already accepted, never put it back to false
        await invitationRepository.save(invitation);

        res.sendStatus(200);
    } catch (e) {
        next(e)
    }
}