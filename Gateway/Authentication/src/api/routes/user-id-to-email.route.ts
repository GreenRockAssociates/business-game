import {Request, Response} from "express";
import {Repository} from "typeorm";
import {UserEntity} from "../../entities/user.entity";
import {validateOrReject} from "class-validator";
import {instanceToPlain} from "class-transformer";
import {UserEmailResponseDto} from "../../dto/user-email-response.dto";

export async function userIdToEmail(req: Request, res: Response, repository: Repository<UserEntity>) {
    const userId = req.query["userId"];
    if (!userId) {
        res.sendStatus(400)
        return;
    }

    const user: UserEntity | null = await repository.findOneBy({
        id: userId.toString()
    })

    if (!user){
        res.sendStatus(404)
        return;
    }

    const response = new UserEmailResponseDto(user.email);
    try {
        await validateOrReject(response);
        res.json(instanceToPlain(response));
    } catch (_) {
        // If the user fetched from the DB is incorrect, it means something went wrong
        res.sendStatus(500);
    }
}