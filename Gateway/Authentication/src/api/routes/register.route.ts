import { Request, Response} from 'express';
import {UserEntity} from "../../entities/user.entity";
import {RegisterUserDto} from "../../dto/register-user.dto";
import {Repository} from "typeorm";

export async function registerUser (req: Request, res: Response, repository: Repository<UserEntity>) {
    const dto = req.body as RegisterUserDto
    const newUser = new UserEntity(
        dto.firstName,
        dto.lastName,
        dto.email
    );
    await newUser.setPassword(dto.password);

    try {
        await repository.save(newUser);
    } catch (e) {
        res.statusMessage = "User already exists";
        res.sendStatus(401);
        return;
    }

    res.sendStatus(200);
}