import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, Response} from "express";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {marketRate} from "../../api/routes/marketRate.route";
import {AssetDto} from "../../dto/asset.dto";
import {GameIdDto} from "../../dto/game-id.dto";

class ResponseMock {
    sendStatus() {}
    send() {}
    json() {}
}

describe("market rate", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;
    let sendJson: jest.SpyInstance;

    let dataSource: DataSource;

    beforeAll(async () => {
        console.log('1')
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        console.log('2')

        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        console.log('3')

        responseMock = new ResponseMock()

        sendStatusSpy = jest.spyOn(responseMock, 'sendStatus');
        sendSpy = jest.spyOn(responseMock, 'send');
        sendJson = jest.spyOn(responseMock, 'json');
        console.log('4')

    })

    afterEach(async () => {
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    it("should work",async ()=> {

        console.log('5')

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

        const parambuy = new GameIdDto(game.id)

        await marketRate({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(MarketEntity));
        console.log('7')

        await expect(sendStatusSpy).toHaveBeenCalledWith(200);


    })


    /*
    it("should work one player",async ()=> {



        const body = new NewGameDto(1)


        await newgame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(sendStatusSpy).toBeCalledTimes(1)

    })
    it("should'nt work 0 player",async ()=> {


        const body = new NewGameDto(0)


        await newgame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledWith(412);
        expect(sendStatusSpy).toBeCalledTimes(1)

    })

    */



})