import {DataSource} from "typeorm";
import {AppDataSource} from "../../index";
import {PlayerEntity} from "../../entities/player.entity";
import {AssetEntity} from "../../entities/asset.entity";
import {PortfolioEntity} from "../../entities/portfolio.entity";

describe('Portfolio entity', () => {
    describe('Database interaction', () => {
        let dataSource: DataSource;

        beforeAll(async () => {
            dataSource = await AppDataSource.initialize().catch((error: Error) => {
                throw new Error(`Error initializing database: ${error.message}`);
            });
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(PortfolioEntity.name).delete({})
            await dataSource.getRepository(PlayerEntity.name).delete({})
            await dataSource.getRepository(AssetEntity.name).delete({})
        })

        afterAll(async () => {
            await dataSource.destroy();
        });

        afterEach(async () => {
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(PortfolioEntity.name).delete({})
            await dataSource.getRepository(PlayerEntity.name).delete({})
            await dataSource.getRepository(AssetEntity.name).delete({})
        })

        it("Should be able to add a portfolio entry to the database", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const player = new PlayerEntity();
            await dataSource.manager.save(player);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.player = player
            portfolioEntry.asset = asset

            await dataSource.manager.save(portfolioEntry)

            const DbResult = await dataSource.getRepository(PortfolioEntity).find({
                relations: {
                    player: true,
                    asset: true
                }
            })
            expect(DbResult.length).toEqual(1)
            const portfolioEntryFromDB = DbResult[0]
            expect(portfolioEntryFromDB.playerId).toEqual(player.id)
            expect(portfolioEntryFromDB.assetTicker).toEqual(asset.ticker)
            expect(portfolioEntryFromDB.player).toEqual(player)
            expect(portfolioEntryFromDB.asset).toEqual(asset)
            expect(typeof portfolioEntryFromDB.count).toEqual(typeof 0.0)
        })

        it("Direct manipulation of PK columns should be possible", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const player = new PlayerEntity();
            await dataSource.manager.save(player);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.playerId = player.id
            portfolioEntry.assetTicker = asset.ticker

            await dataSource.manager.save(portfolioEntry)

            const DbResult = await dataSource.getRepository(PortfolioEntity).find({
                relations: {
                    player: true,
                    asset: true
                }
            })
            expect(DbResult.length).toEqual(1)
            const portfolioEntryFromDB = DbResult[0]
            expect(portfolioEntryFromDB.playerId).toEqual(player.id)
            expect(portfolioEntryFromDB.assetTicker).toEqual(asset.ticker)
            expect(portfolioEntryFromDB.player).toEqual(player)
            expect(portfolioEntryFromDB.asset).toEqual(asset)
            expect(typeof portfolioEntryFromDB.count).toEqual(typeof 0.0)
        })

        it("Insertion should fail if playerId PK doesn't exist", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.playerId = "84ac828c-d808-4101-a214-7d6410c273e1"
            portfolioEntry.assetTicker = asset.ticker

            await expect(dataSource.manager.save(portfolioEntry)).rejects.not.toBeUndefined()
        })

        it("Insertion should fail if player is null", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.asset = asset

            await expect(dataSource.manager.save(portfolioEntry)).rejects.not.toBeUndefined()
        })

        it("Insertion should fail if assetTicker PK doesn't exist", async () => {
            const player = new PlayerEntity();
            await dataSource.manager.save(player);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.playerId = player.id
            portfolioEntry.assetTicker = "RDM"

            await expect(dataSource.manager.save(portfolioEntry)).rejects.not.toBeUndefined()
        })

        it("Insertion should fail if asset is null", async () => {
            const player = new PlayerEntity();
            await dataSource.manager.save(player);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.player = player

            await expect(dataSource.manager.save(portfolioEntry)).rejects.not.toBeUndefined()
        })

        it("Deleting a portfolio entry should not delete the associated player", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const player = new PlayerEntity();
            await dataSource.manager.save(player);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.player = player
            portfolioEntry.asset = asset

            await dataSource.manager.save(portfolioEntry)

            await dataSource.getRepository(PortfolioEntity).delete(portfolioEntry);

            const playerFromDb = await dataSource.getRepository(PlayerEntity).findOneBy({id: player.id});
            expect(playerFromDb).not.toBeNull()
        })

        it("Deleting a portfolio entry should not delete the associated asset", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const player = new PlayerEntity();
            await dataSource.manager.save(player);

            const portfolioEntry = new PortfolioEntity()
            portfolioEntry.count = 10.129
            portfolioEntry.player = player
            portfolioEntry.asset = asset

            await dataSource.manager.save(portfolioEntry)

            await dataSource.getRepository(PortfolioEntity).delete(portfolioEntry);

            const assetFromDb = await dataSource.getRepository(AssetEntity).findOneBy({ticker: asset.ticker});
            expect(assetFromDb).not.toBeNull()
        })

        it("Deleting a portfolio entity should remove it from the user", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
            await dataSource.manager.save(asset);

            const portfolioEntity = new PortfolioEntity();
            portfolioEntity.count = 10;
            portfolioEntity.asset = asset;

            const player = new PlayerEntity();
            player.portfolio = [portfolioEntity];
            await dataSource.manager.save(player);

            await dataSource.getRepository(PortfolioEntity).delete(portfolioEntity)

            const portfolioEntitiesFromDb = await dataSource.getRepository(PortfolioEntity).find();
            const playerFromDb = await dataSource.getRepository(PlayerEntity).findOne({
                where: {
                    id: player.id
                },
                relations: {
                    portfolio: true,
                    game: true
                }
            });
            expect(portfolioEntitiesFromDb.length).toEqual(0);
            expect(playerFromDb.portfolio.length).toEqual(0)
        })
    })
})