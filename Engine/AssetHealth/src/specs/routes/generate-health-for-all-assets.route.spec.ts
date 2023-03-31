import {DataSource, Repository} from "typeorm";
import {AssetHealthFixture} from "../asset-health-fixture";
import {AppDataSource} from "../../../../DataSource/src/index";
import {getMockResponseSpies, MockResponse} from "../mock-response";
import {MockRequest} from "../mock-request";
import {Request, Response} from "express";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {AssetHealthEntity} from "../../../../DataSource/src/entities/asset-health.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {generateNewHealthForAllAssetsRouteFactory} from "../../api/routes/generate-health-for-all-assets.route";

describe("Generate new health state", () => {
    let response: Response;
    let jsonSpy: jest.SpyInstance;
    let sendStatusSpy: jest.SpyInstance;

    let assetHealthFixture: AssetHealthFixture;
    let dataSource: DataSource;
    let healthRepository: Repository<AssetHealthEntity>;
    let assetRepository: Repository<AssetEntity>;
    let gameRepository: Repository<GameEntity>;

    let game: GameEntity;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        assetHealthFixture = new AssetHealthFixture(dataSource);
        await assetHealthFixture.resetDB();

        healthRepository = dataSource.getRepository(AssetHealthEntity);
        assetRepository = dataSource.getRepository(AssetEntity);
        gameRepository = dataSource.getRepository(GameEntity);
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        const responseMock = new MockResponse();
        ({jsonSpy, sendStatusSpy} = getMockResponseSpies(responseMock));
        response = responseMock as unknown as Response;

        game = await assetHealthFixture.insertGame();
    })

    afterEach(async () => {
        await assetHealthFixture.resetDB();
    })

    it("Should generate a new asset health value for each asset", async () => {
        const asset1 = await assetHealthFixture.insertAsset();
        const asset2 = await assetHealthFixture.insertAsset({ticker: "MSFT", name: "Microsoft"});

        await assetHealthFixture.insertHealthData({asset: asset1, game: game});
        await assetHealthFixture.insertHealthData({asset: asset2, game: game});

        const request: Request = new MockRequest( {gameId: game.id}, {currentTick: 10}) as unknown as Request;

        await (generateNewHealthForAllAssetsRouteFactory(gameRepository, assetRepository, healthRepository))(request, response);

        const healthDataFromDB = await healthRepository.find({
            relations: {
                asset: true,
                game: true
            }
        });

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(healthDataFromDB.length).toEqual(4);
        healthDataFromDB.forEach(entry => {
            expect([1, 10]).toContainEqual(entry.generatedTick);
            expect([asset1, asset2]).toContainEqual(entry.asset);
            expect(game).toEqual(entry.game);
            expect(["AAA", "AA", "A", "B", "C", "D", "E", "F"]).toContainEqual(entry.assetRating);
        });
    })

    it("Should generate a first asset health value for each asset if none exist", async () => {
        const asset1 = await assetHealthFixture.insertAsset();
        const asset2 = await assetHealthFixture.insertAsset({ticker: "MSFT", name: "Microsoft"});

        const request: Request = new MockRequest( {gameId: game.id}, {currentTick: 10}) as unknown as Request;

        await (generateNewHealthForAllAssetsRouteFactory(gameRepository, assetRepository, healthRepository))(request, response);

        const healthDataFromDB = await healthRepository.find({
            relations: {
                asset: true,
                game: true
            }
        });

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(healthDataFromDB.length).toEqual(2);
        healthDataFromDB.forEach(entry => {
            expect([1, 10]).toContainEqual(entry.generatedTick);
            expect([asset1, asset2]).toContainEqual(entry.asset);
            expect(game).toEqual(entry.game);
            expect(["AAA", "AA", "A", "B", "C", "D", "E", "F"]).toContainEqual(entry.assetRating);
        });
    })

    it("Should use previous asset value from the right game", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await assetHealthFixture.insertHealthData({asset: asset, generatedTick: 100}); // insert in another game

        const request: Request = new MockRequest( {gameId: game.id}, {currentTick: 10}) as unknown as Request;

        await (generateNewHealthForAllAssetsRouteFactory(gameRepository, assetRepository, healthRepository))(request, response);

        const healthDataFromDB = await healthRepository.find({
            relations: {
                asset: true,
                game: true
            }
        });

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        // If the data has been inserted it means that it didn't find the entry for the other game.
        // Indeed, if it had found it, then it would have refused to insert since currentTick < previous.generatedTick
        expect(healthDataFromDB.length).toEqual(2);
    })

    it("Should refuse to generate an asset health value if the tick is earlier than the latest entry in the db", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await assetHealthFixture.insertHealthData({asset: asset, game: game, generatedTick: 100}); // insert in another game

        const request: Request = new MockRequest( {gameId: game.id}, {currentTick: 10}) as unknown as Request;

        await (generateNewHealthForAllAssetsRouteFactory(gameRepository, assetRepository, healthRepository))(request, response);

        const healthDataFromDB = await healthRepository.find({
            relations: {
                asset: true,
                game: true
            }
        });

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(400);
        expect(healthDataFromDB.length).toEqual(1);
    })

    it("Should return 404 if the game does not exist", async () => {
        const request: Request = new MockRequest( {gameId: "e138a26e-8107-4546-b61d-a9f06b3d605c"}, {currentTick: 10}) as unknown as Request;

        await (generateNewHealthForAllAssetsRouteFactory(gameRepository, assetRepository, healthRepository))(request, response);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })
})