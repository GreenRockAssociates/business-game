import {DataSource} from "typeorm";
import {AppDataSource} from "../../index";
import {AssetEntity} from "../../entities/asset.entity";
import {AssetHealthEntity} from "../../entities/asset-health.entity";
import {GameEntity} from "../../entities/game.entity";

describe('Asset health entity', () => {
    describe('Database interaction', () => {
        let dataSource: DataSource;

        beforeAll(async () => {
            dataSource = await AppDataSource.initialize().catch((error: Error) => {
                throw new Error(`Error initializing database: ${error.message}`);
            });
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(AssetHealthEntity.name).delete({})
            await dataSource.getRepository(GameEntity.name).delete({})
            await dataSource.getRepository(AssetEntity.name).delete({})
        })

        afterAll(async () => {
            await dataSource.destroy();
        });

        afterEach(async () => {
            // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
            await dataSource.getRepository(AssetHealthEntity.name).delete({})
            await dataSource.getRepository(GameEntity.name).delete({})
            await dataSource.getRepository(AssetEntity.name).delete({})
        })

        it("Should be able to add a portfolio entry to the database", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const game = new GameEntity();
            await dataSource.manager.save(game);

            const assetHealth = new AssetHealthEntity()
            assetHealth.assetRating = "AAA"
            assetHealth.game = game
            assetHealth.asset = asset
            assetHealth.generatedTick = 1

            await dataSource.manager.save(assetHealth)

            const DbResult = await dataSource.getRepository(AssetHealthEntity).find({
                relations: {
                    game: true,
                    asset: true
                }
            })
            expect(DbResult.length).toEqual(1)
            const assetHealthEntryFromDB = DbResult[0]
            expect(assetHealthEntryFromDB.gameId).toEqual(game.id)
            expect(assetHealthEntryFromDB.assetTicker).toEqual(asset.ticker)
            expect(assetHealthEntryFromDB.game).toEqual(game)
            expect(assetHealthEntryFromDB.asset).toEqual(asset)
            expect(assetHealthEntryFromDB.assetRating).toEqual(assetHealth.assetRating)
        })

        it("Direct manipulation of PK columns should be possible", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const game = new GameEntity();
            await dataSource.manager.save(game);

            const assetHealth = new AssetHealthEntity()
            assetHealth.assetRating = "AAA"
            assetHealth.gameId = game.id
            assetHealth.assetTicker = asset.ticker
            assetHealth.generatedTick = 1

            await dataSource.manager.save(assetHealth)

            const DbResult = await dataSource.getRepository(AssetHealthEntity).find({
                relations: {
                    game: true,
                    asset: true
                }
            })
            expect(DbResult.length).toEqual(1)
            const assetHealthFromDB = DbResult[0]
            expect(assetHealthFromDB.gameId).toEqual(game.id)
            expect(assetHealthFromDB.assetTicker).toEqual(asset.ticker)
            expect(assetHealthFromDB.game).toEqual(game)
            expect(assetHealthFromDB.asset).toEqual(asset)
            expect(assetHealthFromDB.assetRating).toEqual(assetHealth.assetRating)
        })

        it("Insertion should fail if gameId PK doesn't exist", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const assetHealth = new AssetHealthEntity()
            assetHealth.assetRating = "AAA"
            assetHealth.gameId = "84ac828c-d808-4101-a214-7d6410c273e1"
            assetHealth.assetTicker = asset.ticker
            assetHealth.generatedTick = 1

            await expect(dataSource.manager.save(assetHealth)).rejects.not.toBeUndefined()
        })

        it("Insertion should fail if game is null", async () => {
            const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
            await dataSource.manager.save(asset);

            const assetHealth = new AssetHealthEntity()
            assetHealth.assetRating = "AAA"
            assetHealth.asset = asset
            assetHealth.generatedTick = 1

            await expect(dataSource.manager.save(assetHealth)).rejects.not.toBeUndefined()
        })

        it("Insertion should fail if assetTicker PK doesn't exist", async () => {
            const game = new GameEntity();
            await dataSource.manager.save(game);

            const assetHealth = new AssetHealthEntity()
            assetHealth.assetRating = "AAA"
            assetHealth.gameId = game.id
            assetHealth.assetTicker = "RDM"
            assetHealth.generatedTick = 1

            await expect(dataSource.manager.save(assetHealth)).rejects.not.toBeUndefined()
        })

        it("Insertion should fail if asset is null", async () => {
            const game = new GameEntity();
            await dataSource.manager.save(game);

            const assetHealth = new AssetHealthEntity()
            assetHealth.assetRating = "AAA"
            assetHealth.game = game
            assetHealth.generatedTick = 1

            await expect(dataSource.manager.save(assetHealth)).rejects.not.toBeUndefined()
        })
    })
})