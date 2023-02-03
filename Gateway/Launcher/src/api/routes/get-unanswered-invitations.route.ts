import {Repository} from "typeorm";
import {InvitationEntity} from "../../entities/invitation.entity";
import {Request, Response} from "express";
import {InvitationResponseDto} from "../../dto/invitation-response.dto";
import {plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";

export async function getUnansweredInvitations(req: Request, res: Response, invitationRepository: Repository<InvitationEntity>) {
    const userId = req.session.userId;

    const invitationEntities: InvitationEntity[] = await invitationRepository.find({
        where: {
            userId: userId,
            acceptedInvitation: false
        },
        relations: {
            game: true
        }
    })

    const invitationDTOs: InvitationResponseDto[] = invitationEntities.map(invitationEntity => plainToInstance(InvitationResponseDto, invitationEntity, {excludeExtraneousValues: true, exposeUnsetFields: false}));
    try {
        await validateOrReject(invitationDTOs);
        res.json({
            invitations: invitationDTOs
        })
    } catch (_) {
        res.sendStatus(500);
    }
}