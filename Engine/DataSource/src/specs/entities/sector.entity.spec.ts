import {DataSource} from "typeorm";
import {AppDataSource} from "../../index";
import {SectorEntity} from "../../entities/sector.entity";
import {AssetEntity} from "../../entities/asset.entity";

describe('Sector entity', () => {
    describe('Database interaction', () => {
        let dataSource: DataSource;

        beforeAll(async () => {
            dataSource = await AppDataSource.initialize().catch((error: Error) => {
                throw new Error(`Error initializing database: ${error.message}`);
            });
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(SectorEntity.name).delete({})
        })

        afterAll(async () => {
            await dataSource.destroy();
        });

        afterEach(async () => {
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(SectorEntity.name).delete({})
        })

        it("Should be able to add a sector to the database", async () => {
            const asset = new SectorEntity("Hardware")

            await dataSource.manager.save(asset);

            const DbResponse: SectorEntity[] = await dataSource.getRepository(SectorEntity).find()

            expect(DbResponse.length).toEqual(1);
            const assetFromDB: SectorEntity = DbResponse[0];
            expect(assetFromDB.name).toEqual("Hardware");
        })

        it("Should refuse to insert if a field is missing", async () => {
            let asset = new SectorEntity("")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "name"
                })
            )

            asset = new SectorEntity(undefined)
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "name"
                })
            )
        })

        it("Deleting a sector with assets shouldn't delete the assets themselves", async () => {
            const asset1 = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
            await dataSource.manager.save(asset1);
            const asset2 = new AssetEntity("MSFT", "Microsoft", "A tech company", "logo.png");
            await dataSource.manager.save(asset2);

            const sector = new SectorEntity("Software");
            sector.assets = [asset1, asset2]

            await dataSource.manager.save(sector);

            await dataSource.manager.remove(sector);

            const DbResponse = await dataSource.getRepository(AssetEntity).find()

            expect(DbResponse.length).toEqual(2);
            expect(DbResponse[0].ticker).toEqual("AAPL");
            expect(DbResponse[1].ticker).toEqual("MSFT");
        })
    })
})