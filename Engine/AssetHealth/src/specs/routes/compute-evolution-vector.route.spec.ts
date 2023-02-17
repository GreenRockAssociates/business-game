import {DataSource, Repository} from "typeorm";
import {AssetHealthFixture} from "../asset-health-fixture";
import {AppDataSource} from "../../../../DataSource/src/index";
import {getMockResponseSpies, MockResponse} from "../mock-response";
import {MockRequest} from "../mock-request";
import {Request, Response} from "express";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {AssetHealthEntity} from "../../../../DataSource/src/entities/asset-health.entity";
import {NewsReportEntity} from "../../../../DataSource/src/entities/news-report.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {computeEvolutionVectorRouteFactory} from "../../api/routes/compute-evolution-vector.route";
import {NewsFixture} from "../news-fixture";
import {EvolutionVectorResponseDto} from "../../dto/evolution-vector-response.dto";

describe("Compute evolution vector route", () => {
    let response: Response;
    let jsonSpy: jest.SpyInstance;
    let sendStatusSpy: jest.SpyInstance;

    let dataSource: DataSource;
    let healthRepository: Repository<AssetHealthEntity>;
    let assetRepository: Repository<AssetEntity>;
    let newsReportRepository: Repository<NewsReportEntity>;

    let assetHealthFixture: AssetHealthFixture;
    let newsFixture: NewsFixture;

    let game: GameEntity;

    let route: Function;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        assetHealthFixture = new AssetHealthFixture(dataSource);
        newsFixture = new NewsFixture(dataSource);

        healthRepository = dataSource.getRepository(AssetHealthEntity);
        newsReportRepository = dataSource.getRepository(NewsReportEntity);
        assetRepository = dataSource.getRepository(AssetEntity);

        await healthRepository.delete({});
        await assetRepository.delete({});
        await newsReportRepository.delete({});
        await dataSource.getRepository(GameEntity).delete({});

        route = computeEvolutionVectorRouteFactory(assetRepository, healthRepository, newsReportRepository);
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
        await healthRepository.delete({});
        await assetRepository.delete({});
        await newsReportRepository.delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should properly compute the probability of one asset", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await assetHealthFixture.insertHealthData({asset, game});
        await newsFixture.insertNewsReport({assets: [asset], game});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5676359967924676]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of multiple asset", async () => {
        const asset1 = await assetHealthFixture.insertAsset();
        const asset2 = await assetHealthFixture.insertAsset({ticker: "MSFT", name: "Microsoft"});
        await assetHealthFixture.insertHealthData({asset: asset1, game});
        await assetHealthFixture.insertHealthData({asset: asset2, game});
        await newsFixture.insertNewsReport({assets: [asset1, asset2], game});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5676359967924676],
                ["MSFT", 0.5676359967924676]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset with only health data", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await assetHealthFixture.insertHealthData({asset, game});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.56]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset with health data on the same tick", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await assetHealthFixture.insertHealthData({asset, game, generatedTick: 10});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.56]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset with multiple health data", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await assetHealthFixture.insertHealthData({asset, game});
        await assetHealthFixture.insertHealthData({asset, game, generatedTick: 20, assetRating: "AAA"});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 100}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.6]
            ]),
            100
        ));
    })

    it("Should properly compute the probability of an asset with only one news", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset], game, influenceFactor: -5});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.49045500400941566]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset negative news", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset], game});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5076359967924675]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset with only two news", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset], game});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 2});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.51181869714286]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset with only three news", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset], game});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 2});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 3});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5128653548203821]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset with only more than three news", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset], game});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 2});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 3});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 4});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 10}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5110885111604143]
            ]),
            10
        ));
    })

    it("Should properly compute the probability of an asset with an outdated news and some valid news", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset], game});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 800});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 1000}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5546552801499688]
            ]),
            1000
        ));
    })

    it("Should properly compute the probability of an asset with only outdated news", async () => {
        const asset = await assetHealthFixture.insertAsset();
        await newsFixture.insertNewsReport({assets: [asset], game});
        await newsFixture.insertNewsReport({assets: [asset], game, generatedTick: 2});

        const request: Request = new MockRequest({gameId: game.id, currentTick: 1000}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5]
            ]),
            1000
        ));
    })

    it("Should properly compute the probability of an asset with no health and no news", async () => {
        await assetHealthFixture.insertAsset();

        const request: Request = new MockRequest({gameId: game.id, currentTick: 1000}) as unknown as Request;

        await route(request, response);

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EvolutionVectorResponseDto(
            new Map<string, number>([
                ["APPL", 0.5]
            ]),
            1000
        ));
    })
})