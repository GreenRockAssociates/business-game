import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import * as bcrypt from "bcrypt";
import {UniqueInColumn} from "../decorators/unique-in-column.decorator";

@Entity()
@Unique(['email'])
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    lastname: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @UniqueInColumn({
        primaryKeys: ['id'],
        caseSensitive: false
    })
    @Column()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    passwordHash: string;

    constructor(firstname: string, lastname: string, email: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }

    async setPassword(password: string) {
        this.passwordHash = await bcrypt.hash(password, 10);
    }

    isPasswordValid(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.passwordHash);
    }
}