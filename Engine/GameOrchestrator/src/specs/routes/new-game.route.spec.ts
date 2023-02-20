import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, Response} from "express";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {newGame} from "../../api/routes/new-game.route";
import {NewGameDto} from "../../dto/new-game.dto";
import { AssetEntity } from "../../../../DataSource/src/entities/asset.entity";
import {MockRabbitMqInteractor} from "../mock-rabbit-mq-interactor";
import {MockAxios} from "../mock-axios";
import {AssetHealthService} from "../../libraries/asset-health.service";
import {AxiosInstance} from "axios";
import {RabbitMqInteractor} from "../../message-broker/rabbit-mq-interactor";

class ResponseMock {
    sendStatus() {}
    json() {}
}

describe("new game", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let sendJson: jest.SpyInstance;

    let dataSource: DataSource;

    let rabbitMqInteractor: MockRabbitMqInteractor;

    let axiosInstance: MockAxios;
    let assetHealthService: AssetHealthService;

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
        sendJson = jest.spyOn(responseMock, 'json');

        rabbitMqInteractor = new MockRabbitMqInteractor();

        axiosInstance = new MockAxios();
        assetHealthService = new AssetHealthService(axiosInstance as unknown as AxiosInstance);
    })

    afterEach(async () => {
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    it("should work",async ()=> {
        let validate = require('uuid-validate');
        let nbr = 2;
        const body = new NewGameDto(nbr)
        await newGame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity), dataSource.getRepository(GameEntity), dataSource.getRepository(MarketEntity), dataSource.getRepository(AssetEntity), rabbitMqInteractor as unknown as RabbitMqInteractor, assetHealthService);
        expect(validate(sendJson.mock.calls[0][0]['gameId'])).toBeTruthy()
        expect(sendJson.mock.calls[0][0]['playerIds'].length).toBe(nbr)

        for(let i = 0;i<sendJson.mock.calls[0][0]['playerIds'].length;i++){
            expect(validate(sendJson.mock.calls[0][0]['playerIds'][i])).toBeTruthy()

        }
        expect(sendJson).toBeCalledTimes(1)
        expect(rabbitMqInteractor.sendToGameStartQueue).toHaveBeenCalledTimes(1);
        expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    })

    it("should work one player",async ()=> {
        const body = new NewGameDto(1)


        await newGame({ "body": body} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),dataSource.getRepository(GameEntity), dataSource.getRepository(MarketEntity), dataSource.getRepository(AssetEntity), rabbitMqInteractor as unknown as RabbitMqInteractor, assetHealthService);

        expect(sendJson).toBeCalledTimes(1)
    })
})