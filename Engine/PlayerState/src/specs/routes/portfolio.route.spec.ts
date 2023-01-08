import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, Response} from "express";
import {GameIdDto} from "../../dto/game-id.dto";
import {BuyandsellDto} from "../../dto/buyandsell.dto";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {IdsDto} from "../../dto/ids.dto";
import {portfolio} from "../../api/routes/portfolio.route";
class ResponseMock {
    sendStatus() {}
    send() {}
}

class helper {
    static getRequestObject(gameId : string, assetId : string, quantity : number, playerId : string): Request{
        return {
            params: new GameIdDto(gameId) ,
            body: new BuyandsellDto(quantity, playerId,assetId)
        } as unknown as Request
    }
}

describe("portfolio route", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;

    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        responseMock = new ResponseMock()

        sendStatusSpy = jest.spyOn(responseMock, 'sendStatus');
        sendSpy = jest.spyOn(responseMock, 'send');
    })

    afterEach(async () => {
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    it("should work one asset",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        await dataSource.manager.save(asset);
        const market = new MarketEntity(1,1,true)
        market.game = game;
        market.assetTicker = asset.ticker;
        await dataSource.manager.save(market)
        const player = new PlayerEntity(100);
        player.game = game;
        await dataSource.manager.save(player);
        const portfolioEntry = new PortfolioEntity()
        portfolioEntry.count = 10.10
        portfolioEntry.player = player
        portfolioEntry.asset = asset
        await dataSource.manager.save(portfolioEntry)


        const parambuy = new IdsDto(game.id,player.id)


        await portfolio({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(sendSpy).toHaveBeenCalledWith(`[{"assetId":"AAPL","quantity":10.1}]`);


    })

    it("should work multi assets",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        const asset2 = new AssetEntity("AMZN", "Amazon", "A ecomerce company", "logo.png")
        await dataSource.manager.save(asset);
        await dataSource.manager.save(asset2);
        const market = new MarketEntity(1,1,true)
        const market2 = new MarketEntity(1,1,true)
        market.game = game;
        market2.game = game;
        market.assetTicker = asset.ticker;
        market2.assetTicker = asset2.ticker;
        await dataSource.manager.save(market)
        await dataSource.manager.save(market2)
        const player = new PlayerEntity(100);
        player.game = game;
        await dataSource.manager.save(player);
        const portfolioEntry = new PortfolioEntity()
        portfolioEntry.count = 10.10
        portfolioEntry.player = player
        portfolioEntry.asset = asset
        await dataSource.manager.save(portfolioEntry)
        const portfolioEntry2 = new PortfolioEntity()
        portfolioEntry2.count = 25
        portfolioEntry2.player = player
        portfolioEntry2.asset = asset2
        await dataSource.manager.save(portfolioEntry2)


        const parambuy = new IdsDto(game.id,player.id)


        await portfolio({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(sendSpy).toHaveBeenCalledWith(`[{"assetId":"AAPL","quantity":10.1},{"assetId":"AMZN","quantity":25}]`);


    })



    it("should'nt work player didnt exist",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        await dataSource.manager.save(asset);
        const market = new MarketEntity(1,1,true)
        market.game = game;
        market.assetTicker = asset.ticker;
        await dataSource.manager.save(market)
        const player = new PlayerEntity(100);
        player.game = game;
        await dataSource.manager.save(player);
        const portfolioEntry = new PortfolioEntity()
        portfolioEntry.count = 10.10
        portfolioEntry.player = player
        portfolioEntry.asset = asset
        await dataSource.manager.save(portfolioEntry)


        const parambuy = new IdsDto(game.id,"6c0b9100-b86d-4c13-8ab8-83ce347430dd")


        await portfolio({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(404);

    })

    it("should'nt work game didnt exist",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        await dataSource.manager.save(asset);
        const market = new MarketEntity(1,1,true)
        market.game = game;
        market.assetTicker = asset.ticker;
        await dataSource.manager.save(market)
        const player = new PlayerEntity(100);
        player.game = game;
        await dataSource.manager.save(player);
        const portfolioEntry = new PortfolioEntity()
        portfolioEntry.count = 10.10
        portfolioEntry.player = player
        portfolioEntry.asset = asset
        await dataSource.manager.save(portfolioEntry)


        const parambuy = new IdsDto("6c0b9100-b86d-4c13-8ab8-83ce347430dd",player.id)


        await portfolio({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(404);

    })

    it("should'nt work player not in game",async ()=> {
        const game = new GameEntity()
        await dataSource.manager.save(game)
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        await dataSource.manager.save(asset);
        const market = new MarketEntity(1,1,true)
        market.game = game;
        market.assetTicker = asset.ticker;
        await dataSource.manager.save(market)
        const player = new PlayerEntity(100);
        await dataSource.manager.save(player);
        const portfolioEntry = new PortfolioEntity()
        portfolioEntry.count = 10.10
        portfolioEntry.player = player
        portfolioEntry.asset = asset
        await dataSource.manager.save(portfolioEntry)


        const parambuy = new IdsDto(game.id,player.id)


        await portfolio({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(404);

    })


})