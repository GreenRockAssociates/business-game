import {Request, Response} from "express";
import {Repository} from "typeorm";
import {GameEntity} from "../../entities/game.entity";
import {plainToInstance} from "class-transformer";
import {GameDto} from "../../dto/game.dto";
import {validateOrReject} from "class-validator";

/**
 * Returns all games where the user is either the owner or a player
 *
 * Doesn't return the list of users that compose this game
 * @param req
 * @param res
 * @param repository
 */
export async function getAllGames(req: Request, res: Response, repository: Repository<GameEntity>) {
    const userId = req.session.userId // We know that the userId is valid because of the session middleware

    const games = await repository.find({
        relations: {
            invitations: true,
        },
        where : [
            {ownerId: userId},                                              // Games where the user is the owner, or
            {invitations: {userId: userId, acceptedInvitation: true}}       // Games where the user is a normal player that has accepted the invitation
        ]
    })

    const gameDtos = games.map(game => {
        delete game.invitations // Since only the current user would be returned from the query, delete the invitation list to remove this field from the DTO
        return plainToInstance(GameDto, game, {excludeExtraneousValues: true, exposeUnsetFields: false})
    })

    try {
        for (const dto of gameDtos) {
            await validateOrReject(dto)
        }

        const response = {
            games: gameDtos
        }

        res.status(200);
        res.json(response)
    } catch (e) {
        // Games should be in a correct state, so if a validation fails it means that something was wrong somewhere else on the server
        res.sendStatus(500)
    }
}