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

        let nbr = 2;
        const parambuy = new GameIdDto('0571901f-72ef-4053-bbe7-4e42cc25b3eb')
        console.log('6')

        await marketRate({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(MarketEntity));
        console.log('7')

        await expect(sendStatusSpy).toHaveBeenCalledWith(200);

        console.log('8')



    },1000000) // Ne vous inquietez pas tout vas bien mon cervo est juste entrain de fondre


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