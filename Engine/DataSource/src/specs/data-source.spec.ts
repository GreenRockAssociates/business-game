import {AppDataSource, DataSourceFactory} from "../index";
import {AssetEntity} from "../entities/asset.entity";
import {DataSource} from "typeorm";

describe("Data source", () => {
    it("Should be able to initialize properly if database engine is running", async () => {
        await expect(AppDataSource.initialize()).resolves.not.toBeUndefined();
    })

    /**
     * This test exists to ensure that multiple services can initialize a database without overriding each other
     */
    it("Should not erase the database when initializing", async () => {
        const dataSource = await DataSourceFactory().initialize();

        await dataSource.getRepository(AssetEntity.name).delete({})
        const asset1 = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
        await dataSource.manager.save(asset1);
        const asset2 = new AssetEntity("MSFT", "Microsoft", "A tech company", "logo.png");
        await dataSource.manager.save(asset2);

        await dataSource.destroy();

        const secondDataSource = await DataSourceFactory().initialize();

        await expect(secondDataSource.getRepository(AssetEntity.name).find()).resolves.not.toBeUndefined();

        await secondDataSource.destroy();
    })

    /**
     * This test exists to ensure that multiple services can posses a database connection at once
     */
    it("Many data sources can exist at once", async () => {
        const dataSources: DataSource[] = []
        try {
            for (let i = 0; i < 5; i++){
                dataSources.push(await DataSourceFactory().initialize())
            }
        } catch (e){
            fail(e)
        }

        expect(dataSources).not.toContainEqual(undefined)
        expect(dataSources.length).toEqual(5)

        for (const source of dataSources) {
            await source.destroy();
        }
    })
})