import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, Response} from "express";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {marketRate} from "../../api/routes/marketRate.route";
import {GameIdDto} from "../../dto/game-id.dto";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {assetRate} from "../../api/routes/Asset.route";
import {GameAndAssetIdDto} from "../../dto/gameandassetid.dto";

class ResponseMock {
    sendStatus() {}
    send() {}
    json() {}
}

describe("asset rate", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;
    let sendJson: jest.SpyInstance;

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
        sendJson = jest.spyOn(responseMock, 'json');

    })

    afterEach(async () => {
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("should work",async ()=> {


        const game = new GameEntity()
        await dataSource.manager.save(game)
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        const asset2 = new AssetEntity("AMZN", "Amazon", "A ecomerce company", "logo.png")
        await dataSource.manager.save(asset);
        await dataSource.manager.save(asset2);
        const market = new MarketEntity(1,1,true)
        const market2 = new MarketEntity(1,100,true)
        const market3 = new MarketEntity(2,2,true)
        const market4 = new MarketEntity(2,300,true)
        const market5 = new MarketEntity(3,400,true)
        market.game = game;
        market2.game = game;
        market3.game = game;
        market4.game = game;
        market5.game = game;
        market.assetTicker = asset.ticker;
        market2.assetTicker = asset2.ticker;
        market3.assetTicker = asset.ticker;
        market4.assetTicker = asset2.ticker;
        market5.assetTicker = asset2.ticker;
        await dataSource.manager.save(market)
        await dataSource.manager.save(market2)
        await dataSource.manager.save(market3)
        await dataSource.manager.save(market4)
        await dataSource.manager.save(market5)

        const param = new GameAndAssetIdDto(game.id,"AAPL")

        await assetRate({ "params": param} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(AssetEntity));

        await expect(sendJson).toHaveBeenCalledWith([{"Assetvalues": [], "Description": "A tech company", "IdGame": game.id, "Logo": "logo.png", "Name": "Apple", "Ticker": "AAPL"}]);


    })



    it("should work one asset",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        await dataSource.manager.save(asset);
        const market = new MarketEntity(1,1,true)
        const market3 = new MarketEntity(2,2,true)
        market.game = game;
        market3.game = game;
        market.assetTicker = asset.ticker;
        market3.assetTicker = asset.ticker;
        await dataSource.manager.save(market)
        await dataSource.manager.save(market3)

        const param = new GameAndAssetIdDto(game.id,"AAPL")

        await assetRate({ "params": param} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(AssetEntity));

        await expect(sendJson).toHaveBeenCalledWith([{"Assetvalues": [], "Description": "A tech company", "IdGame": game.id, "Logo": "logo.png", "Name": "Apple", "Ticker": "AAPL"}]);



    })
    it("should'nt work 0 asset",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)

        const param = new GameAndAssetIdDto(game.id,"AAPL")

        await assetRate({ "params": param} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(AssetEntity));

        await expect(sendStatusSpy).toHaveBeenCalledWith(404);


    })


    it("should'nt work 0 game",async ()=> {


        const param = new GameIdDto("14e16078-07af-454c-8083-493682c70c70")

        await assetRate({ "params": param} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(AssetEntity));

        await expect(sendStatusSpy).toHaveBeenCalledWith(404);


    })


})