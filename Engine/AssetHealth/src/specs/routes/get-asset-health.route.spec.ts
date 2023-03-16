import {DataSource} from "typeorm";
import {AssetHealthFixture} from "../asset-health-fixture";
import {AppDataSource} from "../../../../DataSource/src/index";
import {getMockResponseSpies, MockResponse} from "../mock-response";
import {MockRequest} from "../mock-request";
import {Request, Response} from "express";
import {getAssetHealthRouteFactory} from "../../api/routes/get-asset-health.route";
import {AssetHealthResponseDto} from "../../dto/asset-health-response.dto";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {AssetHealthEntity} from "../../../../DataSource/src/entities/asset-health.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";

describe("Get asset health", () => {
    let response: Response;
    let jsonSpy: jest.SpyInstance;
    let sendStatusSpy: jest.SpyInstance;

    let dataSource: DataSource;
    let assetHealthFixture: AssetHealthFixture;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        assetHealthFixture = new AssetHealthFixture(dataSource);
        await assetHealthFixture.resetDB();
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(() => {
        const responseMock = new MockResponse();
        ({jsonSpy, sendStatusSpy} = getMockResponseSpies(responseMock));
        response = responseMock as unknown as Response;
    })

    afterEach(async () => {
        await assetHealthFixture.resetDB();
    })

    it("Should return the asset health", async () => {
        const assetHealthEntity: AssetHealthEntity = await assetHealthFixture.insertHealthData();
        const request = new MockRequest({gameId: assetHealthEntity.game.id, assetTicker: assetHealthEntity.asset.ticker}) as unknown as Request;

        await getAssetHealthRouteFactory(dataSource.getRepository(AssetHealthEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new AssetHealthResponseDto(assetHealthEntity.asset.ticker, assetHealthEntity.generatedTick, assetHealthEntity.assetRating))
    })

    it("Should return the latest asset health entry", async () => {
        const game: GameEntity = await assetHealthFixture.insertGame();
        const asset: AssetEntity = await assetHealthFixture.insertAsset();
        await assetHealthFixture.insertHealthData({game, asset, assetRating: "A", generatedTick: 1});
        const assetHealthEntity2: AssetHealthEntity = await assetHealthFixture.insertHealthData({game, asset, assetRating: "AA", generatedTick: 2});

        const request = new MockRequest({gameId: game.id, assetTicker: asset.ticker}) as unknown as Request;

        await getAssetHealthRouteFactory(dataSource.getRepository(AssetHealthEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new AssetHealthResponseDto(assetHealthEntity2.asset.ticker, assetHealthEntity2.generatedTick, assetHealthEntity2.assetRating))
    })

    it("Should return 404 if the game doesn't exist", async () => {
        const asset: AssetEntity = await assetHealthFixture.insertAsset();
        const request = new MockRequest({gameId: "385101bb-0382-41c6-931b-0557347206be", assetTicker: asset.ticker}) as unknown as Request;

        await getAssetHealthRouteFactory(dataSource.getRepository(AssetHealthEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(0);
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if the asset doesn't exist", async () => {
        const game: GameEntity = await assetHealthFixture.insertGame();
        const request = new MockRequest({gameId: game.id, assetTicker: "MSFT"}) as unknown as Request;

        await getAssetHealthRouteFactory(dataSource.getRepository(AssetHealthEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(0);
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if there is no entry", async () => {
        const game: GameEntity = await assetHealthFixture.insertGame();
        const asset: AssetEntity = await assetHealthFixture.insertAsset();
        const request = new MockRequest({gameId: game.id, assetTicker: asset.ticker}) as unknown as Request;

        await getAssetHealthRouteFactory(dataSource.getRepository(AssetHealthEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(0);
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })
})