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

describe("buy route", () => {
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

    it("should work",async ()=> {

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
        expect(sendSpy).toHaveBeenCalledWith(`{"money":100}`);


    })
    it("should'nt work player didnt exist",async ()=> {



    })

    it("should'nt work game didnt exist",async ()=> {



    })

    it("should'nt work player not in game",async ()=> {


    })


})