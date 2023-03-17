import { Request, Response } from "express";
import {createConnection, DataSource, Repository} from "typeorm";
import {PortfolioEntity} from "../../../DataSource/src/entities/portfolio.entity";
import {AssetEntity} from "../../../DataSource/src/entities/asset.entity";
import {AssetHealthEntity} from "../../../DataSource/src/entities/asset-health.entity";
import {GameEntity} from "../../../DataSource/src/entities/game.entity";
import {MarketEntity} from "../../../DataSource/src/entities/market.entity";
import {NewsReportEntity} from "../../../DataSource/src/entities/news-report.entity";
import {PlayerEntity} from "../../../DataSource/src/entities/player.entity";
import {SectorEntity} from "../../../DataSource/src/entities/sector.entity";
import data from "./templateSectorAndCompany.json";
import {AppDataSource} from "../../../DataSource/src";


export const migrate = async (req: Request, res: Response,repository_sector: Repository<SectorEntity>,repository_asset: Repository<AssetEntity>) => {

    const dataSource = await AppDataSource.initialize().catch((error: Error) => {
        throw new Error(`Error initializing database: ${error.message}`);
    });

    const mySectorMap = await addSector(repository_sector);
    await addCompany(repository_asset,mySectorMap)

};


const addSector = async (repository_sector: Repository<SectorEntity>) => {
    let mySectorMap = new Map<string, SectorEntity>();

    for (let i = 0; i < data.sector.length; i++) {
        const item = data.sector[i];
        const sector = new SectorEntity(item.name)
        await repository_sector.manager.save(sector);
        mySectorMap.set(item.name,sector)
    }

    return mySectorMap
};

const addCompany = async (repository_asset: Repository<AssetEntity>, mySectorMap : Map<string, SectorEntity>) => {

    for (let i = 0; i < data.company.length; i++) {

        const item = data.company[i];

        const company = new AssetEntity(item.assetTicker,item.name,item.description,item.logo)
        for (let y = 0; y < item.sectors.length; y++) {
            company.sectors.push(mySectorMap.get(item.sectors[y]))
        }
        await repository_asset.manager.save(company);


    }
};