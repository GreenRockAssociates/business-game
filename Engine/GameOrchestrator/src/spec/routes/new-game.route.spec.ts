import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, Response} from "express";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {newgame} from "../../api/routes/new-game.route";
import {NewGameDto} from "../../dto/new-game.dto";
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

describe("new game", () => {
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



        const body = new NewGameDto(2)


        await newgame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(sendSpy).toHaveBeenCalledWith(`{"money":100}`);

    })



})