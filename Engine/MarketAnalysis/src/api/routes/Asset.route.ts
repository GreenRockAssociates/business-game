import { Request, Response } from 'express';
import {Repository} from "typeorm";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {GameAndAssetIdDto} from "../../dto/gameandassetid.dto";
import {AssetDetailDto} from "../../dto/asset-detail.dto";


export async function assetRate(req: Request, res: Response, assetRepository : Repository<AssetEntity>) {

    const ids = req.params as unknown as GameAndAssetIdDto

    const asset = await assetRepository.findOne({
        where : {
            ticker :ids.assetID
        },
        relations: {
            sectors: true
        }
    })

    if(!asset){
        res.sendStatus(404)
        return
    }

    res.json(new AssetDetailDto(asset.ticker, asset.name, asset.description, asset.logo, asset.sectors.map(sector => sector.name)))
}