import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty, IsString} from "class-validator";

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
    password: string;

    constructor(firstname: string, lastname: string, email: string, password?: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}