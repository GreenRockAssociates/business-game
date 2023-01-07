import {DataSource} from "typeorm";
import {PortfolioEntity} from "../../entities/portfolio.entity";
import {PlayerEntity} from "../../entities/player.entity";
import {GameEntity} from "../../entities/game.entity";
import {AppDataSource} from "../../index";
import {AssetEntity} from "../../entities/asset.entity";

describe('Player entity', () => {
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
        await dataSource.getRepository(PortfolioEntity.name).delete({})
        await dataSource.getRepository(AssetEntity.name).delete({})
        await dataSource.getRepository(PlayerEntity.name).delete({})
        await dataSource.getRepository(GameEntity.name).delete({})
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
        await dataSource.getRepository(PortfolioEntity.name).delete({})
        await dataSource.getRepository(AssetEntity.name).delete({})
        await dataSource.getRepository(PlayerEntity.name).delete({})
        await dataSource.getRepository(GameEntity.name).delete({})
    })

    it("Should create", async () => {
        const player = new PlayerEntity();
        await dataSource.manager.save(player);

        const playersFromDb = await dataSource.getRepository(PlayerEntity).find({
            relations: {
                portfolio: true,
                game: true
            }
        });

        expect(playersFromDb.length).toEqual(1);
        const playerFromDb = playersFromDb[0];
        expect(playerFromDb.bankAccount).toEqual(0);
        expect(playerFromDb.portfolio).toEqual([]);
    })

    it("Should be able to bind a game", async () => {
        const game = new GameEntity()
        await dataSource.manager.save(game)

        const player = new PlayerEntity();
        player.game = game;
        await dataSource.manager.save(player);

        const playerFromDb = await dataSource.getRepository(PlayerEntity).findOne({
            where: {
                id: player.id
            },
            relations: {
                portfolio: true,
                game: true
            }
        });
        expect(playerFromDb.game).toEqual(game);
    })

    it("Should be able to bind a new portfolio entry without saving the portfolio entry itself", async () => {
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
        await dataSource.manager.save(asset);

        const portfolioEntity = new PortfolioEntity();
        portfolioEntity.count = 10;
        portfolioEntity.asset = asset;

        const player = new PlayerEntity();
        player.portfolio = [portfolioEntity];
        await dataSource.manager.save(player);

        const playerFromDb = await dataSource.getRepository(PlayerEntity).findOne({
            where: {
                id: player.id
            },
            relations: {
                portfolio: true,
                game: true
            }
        });
        expect(playerFromDb.portfolio[0].assetTicker).toEqual(portfolioEntity.assetTicker);
        expect(playerFromDb.portfolio[0].playerId).toEqual(player.id);
        expect(playerFromDb.portfolio[0].count).toEqual(portfolioEntity.count);
    })

    it("Fetching and saving a player without its relations should not erase them", async () => {
        // Create a user with a portfolio entry
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
        await dataSource.manager.save(asset);
        const portfolioEntity = new PortfolioEntity();
        portfolioEntity.count = 10;
        portfolioEntity.asset = asset;
        const player = new PlayerEntity();
        player.portfolio = [portfolioEntity];
        await dataSource.manager.save(player);

        // Fetch the player without the relations, update it, and save it again
        const playerFromDb = await dataSource.getRepository(PlayerEntity).findOneBy({id: player.id});
        playerFromDb.bankAccount = 100;
        await dataSource.manager.save(playerFromDb)
        expect(playerFromDb.portfolio).toBeUndefined() // Since we didn't select the relations, this instance really shouldn't have anything in its portfolio

        // Fetch the player again, with the relations this time
        const playerSecondFetch = await dataSource.getRepository(PlayerEntity).findOne({
            where: {
                id: player.id
            },
            relations: {
                portfolio: true,
                game: true
            }
        });

        expect(playerSecondFetch.bankAccount).toEqual(100)
        expect(playerSecondFetch.portfolio.length).toEqual(1)
        expect(playerSecondFetch.portfolio[0].assetTicker).toEqual(portfolioEntity.assetTicker);
        expect(playerSecondFetch.portfolio[0].playerId).toEqual(player.id);
        expect(playerSecondFetch.portfolio[0].count).toEqual(portfolioEntity.count);
    })

    it("Should be able to remove a portfolio entity from the user's portfolio list", async () => {
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png");
        await dataSource.manager.save(asset);

        const portfolioEntity = new PortfolioEntity();
        portfolioEntity.count = 10;
        portfolioEntity.asset = asset;

        const player = new PlayerEntity();
        player.portfolio = [portfolioEntity];
        await dataSource.manager.save(player);

        player.portfolio = [];
        await dataSource.manager.save(player);

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