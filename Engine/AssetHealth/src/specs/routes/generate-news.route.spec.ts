import {DataSource, Repository} from "typeorm";
import {NewsFixture} from "../news-fixture";
import {AppDataSource} from "../../../../DataSource/src";
import {getMockResponseSpies, MockResponse} from "../mock-response";
import {Request, Response} from "express";
import {NewsReportEntity} from "../../../../DataSource/src/entities/news-report.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import { MockRequest } from "../mock-request";
import {generateNewsRouteFactory} from "../../api/routes/generate-news.route";
import {
    GenericCompanyNewsGenerator,
    GenericNewsTemplate,
    SpecificNewsTemplate,
    SpecificSectorNewsGenerator
} from "../../libraries/news-templates";

describe("Get all news route", () => {
    let response: Response;
    let jsonSpy: jest.SpyInstance;
    let sendStatusSpy: jest.SpyInstance;

    let newsFixture: NewsFixture;
    let dataSource: DataSource;
    let newsReportRepository: Repository<NewsReportEntity>;
    let assetRepository: Repository<AssetEntity>;
    let gameRepository: Repository<GameEntity>;

    let game: GameEntity;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        newsFixture = new NewsFixture(dataSource);
        await newsFixture.resetDB();

        newsReportRepository = dataSource.getRepository(NewsReportEntity);
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

        game = await newsFixture.insertGame();
    })

    afterEach(async () => {
        await newsFixture.resetDB();
    })

    it("Should insert a news in the database", async () => {
        const asset: AssetEntity = await newsFixture.insertAsset();
        const request: Request = new MockRequest( {gameId: game.id}, {currentTick: 10}) as unknown as Request;

        const generators = [new GenericCompanyNewsGenerator(new GenericNewsTemplate(
            "[[company]] lorem ipsum",
            "[[company]] lorem ipsum",
            1
        ))]

        await (generateNewsRouteFactory(newsReportRepository, assetRepository, gameRepository, generators)(request, response));

        const newsReportFromDb: NewsReportEntity = (await newsReportRepository.find({
            relations: {
                assets: true,
                game: true
            }
        }))[0];

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(201);
        expect(newsReportFromDb).toBeTruthy();
        expect(newsReportFromDb.generatedTick).toEqual(request.body.currentTick);
        expect(newsReportFromDb.title).toEqual("Apple lorem ipsum");
        expect(newsReportFromDb.content).toEqual("Apple lorem ipsum");
        expect(newsReportFromDb.assets).toEqual([asset]);
        expect(newsReportFromDb.game).toEqual(game);
    })

    it("Should return 404 if the game doesn't exist", async () => {
        await newsFixture.insertAsset();
        const request: Request = new MockRequest( {gameId: "3ddab392-41d6-494c-ab4d-6ebbc2fde591"}, {currentTick: 10}) as unknown as Request;

        const generators = [new GenericCompanyNewsGenerator(new GenericNewsTemplate(
            "[[company]] lorem ipsum",
            "[[company]] lorem ipsum",
            1
        ))]

        await (generateNewsRouteFactory(newsReportRepository, assetRepository, gameRepository, generators)(request, response));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should use all available assets", async () => {
        const asset1: AssetEntity = await newsFixture.insertAsset({sectors: ["Technology"]});
        const asset2: AssetEntity = await newsFixture.insertAsset({ticker: "MSFT", name: "Microsoft", sectors: ["Technology"]});
        await newsFixture.insertAsset({ticker: "TTE", name: "Total énergie", sectors: ["Energie"]});
        const request: Request = new MockRequest( {gameId: game.id}, {currentTick: 10}) as unknown as Request;

        const generators = [new SpecificSectorNewsGenerator(new SpecificNewsTemplate(
            "Technology lorem ipsum",
            "Technology lorem ipsum",
            1,
            "Technology"
        ))]

        await (generateNewsRouteFactory(newsReportRepository, assetRepository, gameRepository, generators)(request, response));

        const newsReportFromDb: NewsReportEntity = (await newsReportRepository.find({
            relations: {
                assets: true,
                game: true
            }
        }))[0];

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(201);
        expect(newsReportFromDb).toBeTruthy();
        expect(newsReportFromDb.generatedTick).toEqual(request.body.currentTick);
        expect(newsReportFromDb.title).toEqual("Technology lorem ipsum");
        expect(newsReportFromDb.content).toEqual("Technology lorem ipsum");
        expect(newsReportFromDb.assets.map(asset => asset.ticker)).toEqual([asset1.ticker, asset2.ticker]);
        expect(newsReportFromDb.game).toEqual(game);
    })

    it("Should handle a database with no assets", async () => {
        const request: Request = new MockRequest( {gameId: game.id}, {currentTick: 10}) as unknown as Request;

        const generators = [new SpecificSectorNewsGenerator(new SpecificNewsTemplate(
            "Technology lorem ipsum",
            "Technology lorem ipsum",
            1,
            "Technology"
        ))]

        await (generateNewsRouteFactory(newsReportRepository, assetRepository, gameRepository, generators)(request, response));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(201);
    })
})