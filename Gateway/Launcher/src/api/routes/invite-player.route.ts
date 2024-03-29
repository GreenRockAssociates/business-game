import {Repository} from "typeorm";
import {InvitationEntity} from "../../entities/invitation.entity";
import {NextFunction, Request, Response} from "express";
import {GameIdDto} from "../../dto/game-id.dto";
import {UserEmailDto} from "../../dto/user-email.dto";
import {AxiosInstance} from "axios";
import {plainToInstance} from "class-transformer";
import {UserIdDto} from "../../dto/user-id.dto";
import {validateOrReject} from "class-validator";
import {GameEntity, GameState} from "../../entities/game.entity";

async function getIdFromEmail(req: Request, res: Response, axios: AxiosInstance, playerEmail: UserEmailDto) {
    await validateOrReject(playerEmail); // Ensure we do have an email
    let {data} = await axios.get(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/userId?userEmail=${playerEmail.userEmail}`, {
        headers: {cookie: req.headers.cookie}
    })
    const userIdDto: UserIdDto = plainToInstance(UserIdDto, data as object, {excludeExtraneousValues: true})
    await validateOrReject(userIdDto)
    return userIdDto.userId;
}

export async function invitePlayer(req: Request, res: Response, next: NextFunction, invitationRepository: Repository<InvitationEntity>, gameRepository: Repository<GameEntity>, axios: AxiosInstance) {
    try {
        const userId = req.session.userId // Can use it directly because the middleware ensures the data is valid

        const gameId: GameIdDto = req.params as unknown as GameIdDto;
        const playerEmail: UserEmailDto = req.body;

        let invitedPlayerId;
        try {
            invitedPlayerId = await getIdFromEmail(req, res, axios, playerEmail);
        } catch (e) {
            res.statusMessage = "No player found"
            res.sendStatus(404);
            return;
        }

        // Check that the player isn't trying to invite themselves
        if (userId === invitedPlayerId) {
            res.statusMessage = "Can't invite self"
            res.sendStatus(412);
            return;
        }

        // Check preconditions on game
        const game = await gameRepository.findOneBy({id: gameId.gameId})
        if (!game) {
            res.statusMessage = "No game found"
            res.sendStatus(404);
            return;
        }
        if (game.ownerId !== userId) {
            res.statusMessage = "No game found"
            res.sendStatus(404);
            return;
        }
        if (game.gameState !== GameState.CREATED) {
            res.sendStatus(412);
            return;
        }

        // Create the invitation and save it
        const existingInvitation = await invitationRepository.findOneBy({
            userId: invitedPlayerId,
            gameId: game.id
        })
        const invitation = new InvitationEntity(invitedPlayerId, existingInvitation?.acceptedInvitation ?? false)
        invitation.game = game;
        await invitationRepository.save(invitation);

        res.sendStatus(200);
    } catch (e) {
        next(e)
    }
}