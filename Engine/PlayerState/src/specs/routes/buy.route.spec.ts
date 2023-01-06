import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, response, Response} from "express";
import {GameIdDto} from "../../dto/game-id.dto";
import {BuyandsellDto} from "../../dto/buyandsell.dto";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {buy} from "../../api/routes/buy.route";
class ResponseMock {
    sendStatus() {}
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
        await dataSource.manager.save(player);
        const portfolioEntry = new PortfolioEntity()
        portfolioEntry.count = 10.10
        portfolioEntry.player = player
        portfolioEntry.asset = asset
        await dataSource.manager.save(portfolioEntry)

        const bodybuy = new BuyandsellDto(100, player.id ,asset.ticker)
        const parambuy = new GameIdDto(game.id)

        await buy({"body": bodybuy, "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity), dataSource.getRepository(MarketEntity));

        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        const playerFromDb = await dataSource.getRepository(PlayerEntity).findOne({
            where : {
                id : player.id
            },
            relations : {
                portfolio : true
            }
        })
        expect(playerFromDb.bankAccount).toEqual(player.bankAccount - 100)
        expect(playerFromDb.portfolio.find(asset => asset.assetTicker === "AAPL").count).toEqual(portfolioEntry.count + 100)
    })
})