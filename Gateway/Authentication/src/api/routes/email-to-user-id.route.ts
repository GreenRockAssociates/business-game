import {Request, Response} from "express";
import {Repository} from "typeorm";
import {UserEntity} from "../../entities/user.entity";
import {UserIdResponseDto} from "../../dto/user-id-response.dto";
import {validateOrReject} from "class-validator";
import {instanceToPlain} from "class-transformer";

export async function emailToUserId(req: Request, res: Response, repository: Repository<UserEntity>) {
    const userEmail = req.query["userEmail"];
    if (!userEmail) {
        res.sendStatus(400)
        return;
    }

    const user: UserEntity | null = await repository.findOneBy({
        email: userEmail.toString()
    })

    if (!user){
        res.sendStatus(404)
        return;
    }

    const response = new UserIdResponseDto(user.id);
    try {
        await validateOrReject(response);
        res.json(instanceToPlain(response));
    } catch (_) {
        // If the user fetched from the DB is incorrect, it means something went wrong
        res.sendStatus(500);
    }
}