import {Entity, ManyToMany, PrimaryColumn} from "typeorm";
import {AssetEntity} from "./asset.entity";
import {IsNotEmpty, IsString, MaxLength} from "class-validator";

@Entity()
export class SectorEntity {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @PrimaryColumn("varchar", { length: 255 })
    name: string

    @ManyToMany(() => AssetEntity, (asset: AssetEntity) => asset.sectors)
    assets: AssetEntity[]

    constructor(name: string) {
        this.name = name;
    }
}