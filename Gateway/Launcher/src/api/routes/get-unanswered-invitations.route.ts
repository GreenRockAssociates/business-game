import {Repository} from "typeorm";
import {InvitationEntity} from "../../entities/invitation.entity";
import {Request, Response} from "express";
import {InvitationResponseDto} from "../../dto/invitation-response.dto";
import {instanceToPlain, plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";
import {AuthenticationService} from "../../libraries/authentication.service";

export async function getUnansweredInvitations(req: Request, res: Response, invitationRepository: Repository<InvitationEntity>, authenticationService: AuthenticationService) {
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

    // Add the game's owner email to each invitation
    const plainInvitations: Record<string, any>[] = instanceToPlain(invitationEntities) as Record<string, any>[];
    await Promise.all(
        invitationEntities.map(async (invitation, index) => {
            plainInvitations[index]['userEmail'] = await authenticationService.getUserEmail(invitation.game.ownerId, req.headers)
        })
    )

    const invitationDTOs: InvitationResponseDto[] = plainToInstance(InvitationResponseDto, plainInvitations, {excludeExtraneousValues: true, exposeUnsetFields: false});
    try {
        await validateOrReject(invitationDTOs);
        res.json({
            invitations: invitationDTOs
        })
    } catch (_) {
        res.sendStatus(500);
    }
}