import {DataSource} from "typeorm";
import {AppDataSource} from "../../index";
import {AssetEntity} from "../../entities/asset.entity";
import {SectorEntity} from "../../entities/sector.entity";

describe('Asset entity', () => {
    describe('Database interaction', () => {
        let dataSource: DataSource;

        beforeAll(async () => {
            dataSource = await AppDataSource.initialize().catch((error: Error) => {
                throw new Error(`Error initializing database: ${error.message}`);
            });
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(AssetEntity.name).delete({})
            await dataSource.getRepository(SectorEntity.name).delete({})
        })

        afterAll(async () => {
            await dataSource.destroy();
        });

        afterEach(async () => {
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(AssetEntity.name).delete({})
            await dataSource.getRepository(SectorEntity.name).delete({})
        })

        it("Should be able to add an asset to the database", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")

            await dataSource.manager.save(asset);

            const DbResponse: AssetEntity[] = await dataSource.getRepository(AssetEntity).find()

            expect(DbResponse.length).toEqual(1);
            const assetFromDB: AssetEntity = DbResponse[0];
            expect(assetFromDB.ticker).toEqual("AAPL");
            expect(assetFromDB.name).toEqual("Apple");
            expect(assetFromDB.description).toEqual("A tech company");
            expect(assetFromDB.logo).toEqual("logo.png");
            expect(assetFromDB.sectors).toBeUndefined();
        })

        it("Should refuse to insert if a field is missing", async () => {
            let asset = new AssetEntity("", "Apple", "A tech company", "logo.png")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "ticker"
                })
            )

            asset = new AssetEntity(undefined, "Apple", "A tech company", "logo.png")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "ticker"
                })
            )

            asset = new AssetEntity("AAPL", "", "A tech company", "logo.png")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "name"
                })
            )

            asset = new AssetEntity("AAPL", undefined, "A tech company", "logo.png")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "name"
                })
            )

            asset = new AssetEntity("AAPL", "Apple", "", "logo.png")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "description"
                })
            )

            asset = new AssetEntity("AAPL", "Apple", undefined, "logo.png")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "description"
                })
            )

            asset = new AssetEntity("AAPL", "Apple", "A tech company", "")
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "logo"
                })
            )

            asset = new AssetEntity("AAPL", "Apple", "A tech company", undefined)
            await expect(dataSource.manager.save(asset)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "logo"
                })
            )
        })

        it("Should be able to add sectors to an asset", async () => {
            const sector1 = new SectorEntity("Software");
            const sector2 = new SectorEntity("Hardware");

            await dataSource.manager.save(sector1);
            await dataSource.manager.save(sector2);

            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
            asset.sectors = [sector1, sector2];

            await dataSource.manager.save(asset);

            const DbResponse: AssetEntity[] = await dataSource.getRepository(AssetEntity).find({
                where: {
                    ticker: "AAPL"
                },
                relations : {
                    sectors: true
                }
            })

            expect(DbResponse.length).toEqual(1);
            const assetFromDB: AssetEntity = DbResponse[0];
            expect(assetFromDB.sectors).toEqual([sector1, sector2]);
        })

        it("Deleting an asset with sectors shouldn't delete the sectors themselves", async () => {
            const sector1 = new SectorEntity("Software");
            const sector2 = new SectorEntity("Hardware");

            await dataSource.manager.save(sector1);
            await dataSource.manager.save(sector2);

            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
            asset.sectors = [sector1, sector2];

            await dataSource.manager.save(asset);

            await dataSource.manager.remove(asset);

            const DbResponse = await dataSource.getRepository(SectorEntity).find()

            expect(DbResponse.length).toEqual(2);
            expect(DbResponse[0].name).toEqual("Software");
            expect(DbResponse[1].name).toEqual("Hardware");
        })
    })
})