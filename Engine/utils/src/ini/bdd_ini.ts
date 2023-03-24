import {DataSource} from "typeorm";
import {AssetEntity} from "../../../DataSource/src/entities/asset.entity";
import {SectorEntity} from "../../../DataSource/src/entities/sector.entity";
import {AppDataSource} from "../../../DataSource/src";
import * as fs from "fs";

interface jsonTemplate {
    sector: {name: string}[],
    company: {
        name: string,
        description: string,
        logo: string,
        sectors : string[],
        assetTicker: string
    }[],
}

export async function migrate() {

    const json: jsonTemplate = JSON.parse(fs.readFileSync(__dirname + '/templateSectorAndCompany.json', 'utf8'));

    const dataSource = await AppDataSource.initialize().catch((error: Error) => {
        throw new Error(`Error initializing database: ${error.message}`);
    });

    await dataSource.getRepository(AssetEntity).delete({});
    await dataSource.getRepository(SectorEntity).delete({});

    const mySectorMap = await addSector(json, dataSource);
    await addCompany(json, dataSource, mySectorMap)

}


async function addSector (json: jsonTemplate, dataSource: DataSource) {
    let mySectorMap = new Map<string, SectorEntity>();

    for (let i = 0; i < json.sector.length; i++) {
        const item = json.sector[i];
        const sector = new SectorEntity(item.name)
        await repository_sector.manager.save(sector);
        mySectorMap.set(item.name,sector)
    }

    return mySectorMap
}

async function addCompany (json: jsonTemplate, dataSource: DataSource, mySectorMap : Map<string, SectorEntity>) {

    for (let i = 0; i < json.company.length; i++) {

        try {
            const item = json.company[i];

            const company = new AssetEntity(item.assetTicker,item.name,item.description,item.logo)
            company.sectors = [];
            for (let y = 0; y < item.sectors.length; y++) {
                company.sectors.push(mySectorMap.get(item.sectors[y]))
            }
            await dataSource.manager.save(company);
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}