import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, IsString, validateOrReject, ValidationError} from "class-validator";
import * as bcrypt from "bcrypt";

@Entity()
@Unique(["email"])
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
    @Column()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Column({select: false})
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