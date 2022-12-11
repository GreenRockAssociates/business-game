import { Request, Response} from 'express';
import {UserEntity} from "../../entities/user.entity";
import {Repository} from "typeorm";
import {ChangePasswordDto} from "../../dto/change-password.dto";
import * as bcrypt from "bcrypt"

export async function changePassword(req: Request, res: Response, repository: Repository<UserEntity>) {
    const dto = req.body as ChangePasswordDto;
    const user: UserEntity | null = await repository.findOneBy({
        id: req.session.data.userId // Assume `session.data` is not undefined since there should be a middleware taking care of that higher in the call chain
    });

    // If the user does not exist, return 401
    if (!user){
        res.sendStatus(401);
        return;
    }

    // If the password is invalid, return 401 as well
    // Don't leave any way to distinguish between wrong session or wrong password
    if (!await bcrypt.compare(dto.oldPassword, user.passwordHash) ){
        res.sendStatus(401);
        return;
    }

    // Set the new password
    await user.setPassword(dto.newPassword)

    // Save the user
    await repository.save(user);
    res.sendStatus(200);
}