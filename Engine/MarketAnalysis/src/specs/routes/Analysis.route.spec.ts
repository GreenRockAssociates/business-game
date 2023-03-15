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
import {AnalysisRoute} from "../../api/routes/Analysis.route";
import {GameAndAssetIdDto} from "../../dto/gameandassetid.dto";

class ResponseMock {
    sendStatus() {}
    send() {}
    json() {}
}

describe("market Analysis", () => {
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
        const asset3 = new AssetEntity("AMZN2", "Amazon2", "A ecomerce company but better", "logo.png")
        await dataSource.manager.save(asset);
        await dataSource.manager.save(asset2);
        await dataSource.manager.save(asset3);
        const ticker = ["AAPL","AMZN","AMZN2"]
        for(let i = 0;i<3;i++){
            for(let j = 0;j<100;j++){

                let value3 = Math.floor(Math.random() * 100);
                const market = new MarketEntity(j,value3,true)
                market.game = game;
                market.assetTicker = ticker[i];
                await dataSource.manager.save(market)

            }
        }
        console.log('aaaaa')

        const param = new GameAndAssetIdDto(game.id,"AAPL")

        await AnalysisRoute({ "params": param} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(MarketEntity),dataSource.getRepository(AssetEntity));

    })

})