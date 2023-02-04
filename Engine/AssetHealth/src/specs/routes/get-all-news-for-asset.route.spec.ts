import {DataSource} from "typeorm";
import {AppDataSource} from "@AppDataSource/index";
import {getMockResponseSpies, MockResponse} from "../mock-response";
import {NewsFixture} from "../news-fixture";
import {NewsReportEntity} from "@AppDataSource/entities/news-report.entity";
import {Request, Response} from "express";
import {MockRequest} from "../mock-request";
import {NewsReportDto, NewsResponseDto} from "../../dto/news-response.dto";
import {getAllNewsForAssetRouteFactory} from "../../api/routes/get-all-news-for-asset.route";

describe("Get all news for asset route", () => {
    let response: Response;
    let jsonSpy: jest.SpyInstance;
    let sendStatusSpy: jest.SpyInstance;

    let dataSource: DataSource;
    let newsFixture: NewsFixture;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        newsFixture = new NewsFixture(dataSource);
        await newsFixture.resetDB();
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
        await newsFixture.resetDB();
    })

    it("Should fetch all the news from the DB if they exist", async () => {
        const newsReportEntity: NewsReportEntity = await newsFixture.insertNewsReport();
        const request: Request = new MockRequest(newsReportEntity.game.id, newsReportEntity.assets[0].ticker) as unknown as Request;

        await getAllNewsForAssetRouteFactory(dataSource.getRepository(NewsReportEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new NewsResponseDto([
            new NewsReportDto(newsReportEntity.id, newsReportEntity.generatedTick, newsReportEntity.title, newsReportEntity.content, newsReportEntity.influenceFactor)
        ]))
    })

    it("Should fetch only the news for the right game", async () => {
        const asset = await newsFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset]});
        const newsReportEntity: NewsReportEntity = await newsFixture.insertNewsReport({assets: [asset]});
        const request: Request = new MockRequest(newsReportEntity.game.id, newsReportEntity.assets[0].ticker) as unknown as Request;

        await getAllNewsForAssetRouteFactory(dataSource.getRepository(NewsReportEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new NewsResponseDto([
            new NewsReportDto(newsReportEntity.id, newsReportEntity.generatedTick, newsReportEntity.title, newsReportEntity.content, newsReportEntity.influenceFactor)
        ]))
    })

    it("Should fetch all news", async () => {
        const game = await newsFixture.insertGame();
        const asset = await newsFixture.insertAsset();
        const newsReportEntity1: NewsReportEntity = await newsFixture.insertNewsReport({game: game, assets: [asset]});
        const newsReportEntity2: NewsReportEntity = await newsFixture.insertNewsReport({game: game, assets: [asset]});
        const request: Request = new MockRequest(game.id, asset.ticker) as unknown as Request;

        await getAllNewsForAssetRouteFactory(dataSource.getRepository(NewsReportEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new NewsResponseDto([
            new NewsReportDto(newsReportEntity1.id, newsReportEntity1.generatedTick, newsReportEntity1.title, newsReportEntity1.content, newsReportEntity1.influenceFactor),
            new NewsReportDto(newsReportEntity2.id, newsReportEntity2.generatedTick, newsReportEntity2.title, newsReportEntity2.content, newsReportEntity2.influenceFactor)
        ]))
    })

    it("Should return empty list if no news in DB", async () => {
        const request: Request = new MockRequest("ee02d831-119b-4717-ae01-0a4444d8bcdb") as unknown as Request;

        await getAllNewsForAssetRouteFactory(dataSource.getRepository(NewsReportEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new NewsResponseDto([]))
    })

    it("Should fetch only the news for this specific asset", async () => {
        const game = await newsFixture.insertGame();
        const asset1 = await newsFixture.insertAsset();
        const asset2 = await newsFixture.insertAsset({ticker: "MSFT", name: "Microsoft"});

        const newsReportEntity1: NewsReportEntity = await newsFixture.insertNewsReport({game: game, assets: [asset1]});
        await newsFixture.insertNewsReport({game: game, assets: [asset2]});
        const newsReportEntity3: NewsReportEntity = await newsFixture.insertNewsReport({game: game, assets: [asset1, asset2]});

        const request: Request = new MockRequest(game.id, asset1.ticker) as unknown as Request;

        await getAllNewsForAssetRouteFactory(dataSource.getRepository(NewsReportEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new NewsResponseDto([
            new NewsReportDto(newsReportEntity1.id, newsReportEntity1.generatedTick, newsReportEntity1.title, newsReportEntity1.content, newsReportEntity1.influenceFactor),
            new NewsReportDto(newsReportEntity3.id, newsReportEntity3.generatedTick, newsReportEntity3.title, newsReportEntity3.content, newsReportEntity3.influenceFactor)
        ]))
    })

    it("Should fetch only the news for this specific game and asset", async () => {
        const game1 = await newsFixture.insertGame();
        const game2 = await newsFixture.insertGame();
        const asset1 = await newsFixture.insertAsset();
        const asset2 = await newsFixture.insertAsset({ticker: "MSFT", name: "Microsoft"});

        const newsReportEntity1: NewsReportEntity = await newsFixture.insertNewsReport({game: game1, assets: [asset1]});
        await newsFixture.insertNewsReport({game: game1, assets: [asset2]});
        const newsReportEntity3: NewsReportEntity = await newsFixture.insertNewsReport({game: game1, assets: [asset1, asset2]});
        await newsFixture.insertNewsReport({game: game2, assets: [asset1, asset2]});

        const request: Request = new MockRequest(game1.id, asset1.ticker) as unknown as Request;

        await getAllNewsForAssetRouteFactory(dataSource.getRepository(NewsReportEntity))(request, response);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledWith(new NewsResponseDto([
            new NewsReportDto(newsReportEntity1.id, newsReportEntity1.generatedTick, newsReportEntity1.title, newsReportEntity1.content, newsReportEntity1.influenceFactor),
            new NewsReportDto(newsReportEntity3.id, newsReportEntity3.generatedTick, newsReportEntity3.title, newsReportEntity3.content, newsReportEntity3.influenceFactor)
        ]))
    })
})