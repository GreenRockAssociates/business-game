import { Request, Response } from "express";
import {createConnection, DataSource} from "typeorm";
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


export const migrate = async (req: Request, res: Response) => {

    const dataSource = await AppDataSource.initialize().catch((error: Error) => {
        throw new Error(`Error initializing database: ${error.message}`);
    });

    const mySectorMap = await addSector(dataSource);
    await addCompany(dataSource,mySectorMap)

};


const addSector = async (dataSource: DataSource) => {
    let mySectorMap = new Map<string, SectorEntity>();

    for (let i = 0; i < data.sector.length; i++) {
        const item = data.sector[i];
        const sector = new SectorEntity(item.name)
        await dataSource.manager.save(sector);
        mySectorMap.set(item.name,sector)
    }

    return mySectorMap
};

const addCompany = async (dataSource: DataSource, mySectorMap : Map<string, SectorEntity>) => {

    for (let i = 0; i < data.company.length; i++) {

        const item = data.company[i];

        const company = new AssetEntity(item.assetTicker,item.name,item.description,item.logo)
        for (let y = 0; y < item.sectors.length; y++) {
            company.sectors.push(mySectorMap.get(item.sectors[y]))
        }
        await dataSource.manager.save(company);


    }
};