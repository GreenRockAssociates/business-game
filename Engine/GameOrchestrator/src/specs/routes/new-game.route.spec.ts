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
    json() {}
}

describe("new game", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let jsonSpy: jest.SpyInstance;

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
        jsonSpy = jest.spyOn(responseMock, 'json');
    })

    afterEach(async () => {
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    it("should work",async ()=> {
        const body = new NewGameDto(2)


        await newgame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(0)
        expect(jsonSpy).toHaveBeenCalledTimes(1)
    })
    it("should work one player",async ()=> {



        const body = new NewGameDto(1)


        await newgame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(0);
        expect(jsonSpy).toHaveBeenCalledTimes(1);
    })
    it("should'nt work 0 player",async ()=> {



        const body = new NewGameDto(0)


        await newgame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledWith(412);

    })



})