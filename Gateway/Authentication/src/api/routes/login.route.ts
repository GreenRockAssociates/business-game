import {Request, Response} from 'express';
import {UserEntity} from "../../entities/user.entity";
import {ILike, Repository} from "typeorm";
import {LoginDto} from "../../dto/login.dto";
import * as bcrypt from 'bcrypt'

export async function login(req: Request, res: Response, repository: Repository<UserEntity>) {
    const dto = req.body as LoginDto
    const user: UserEntity | null = await repository.findOneBy({
        email: ILike(dto.email)
    });

    // If the user does not exist, return 401
    if (!user){
        res.sendStatus(401)
        return;
    }

    // If the password is invalid, return 401 as well
    // Don't leave any way to distinguish between wrong email or wrong password
    if (!await bcrypt.compare(dto.password, user.passwordHash) ){
        res.sendStatus(401)
        return;
    }

    req.session.regenerate((err) => {
        if (err) {
            res.sendStatus(500);
            return;
        }

        req.session.data = {
            userId: user.id
        };

        req.session.save((err) => {
            if (err) {
                res.sendStatus(500);
                return;
            }

            res.sendStatus(200);
        })
    })
}