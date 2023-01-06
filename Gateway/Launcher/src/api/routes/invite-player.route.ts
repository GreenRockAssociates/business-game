import {Repository} from "typeorm";
import {InvitationEntity} from "../../entities/invitation.entity";
import {Request, Response} from "express";
import {GameIdDto} from "../../dto/game-id.dto";
import {InvitePlayerRequestDto} from "../../dto/invite-player-request.dto";
import axios from "axios";
import {plainToInstance} from "class-transformer";
import {UserIdDto} from "../../dto/user-id.dto";
import {validateOrReject} from "class-validator";
import {GameEntity, GameState} from "../../entities/game.entity";

export async function invitePlayer(req: Request, res: Response, invitationRepository: Repository<InvitationEntity>, gameRepository: Repository<GameEntity>) {
    const userId = req.session.userId // Can use it directly because the middleware ensures the data is valid

    const gameId: GameIdDto = req.params as unknown as GameIdDto;
    const playerEmail: InvitePlayerRequestDto = req.body;

    // Convert player email to player id
    let invitedPlayerId
    try {
        await validateOrReject(playerEmail); // Ensure we do have an email
        let {data} = await axios.get(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/userId?userEmail=${playerEmail}`, {
            headers: {cookie: req.headers.cookie}
        })
        data = plainToInstance(UserIdDto, data, {excludeExtraneousValues: true})
        await validateOrReject(data)
        invitedPlayerId = data.id;
    } catch (_) {
        res.sendStatus(404);
        return;
    }
    if(!invitedPlayerId){
        res.sendStatus(404);
        return;
    }

    // Check preconditions on game
    const game = await gameRepository.findOneBy({id: gameId.gameId})
    if (game.ownerId !== userId){
        res.sendStatus(404);
        return;
    }
    if (game.gameState !== GameState.CREATED){
        res.sendStatus(412);
        return;
    }

    // Create the invitation and save it
    const invitation = new InvitationEntity(invitedPlayerId, false)
    invitation.game = game;
    await invitationRepository.save(invitation);

    res.sendStatus(200);
}