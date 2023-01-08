import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, Response} from "express";
import {GameIdDto} from "../../dto/game-id.dto";
import {BuyandsellDto} from "../../dto/buyandsell.dto";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {bankAcount} from "../../api/routes/bank-account.route";
import {IdsDto} from "../../dto/ids.dto";
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

describe("bank acount", () => {
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

        const player = new PlayerEntity(100);
        player.game = game
        await dataSource.manager.save(player);

        const parambuy = new IdsDto(game.id,player.id)


        await bankAcount({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(sendSpy).toHaveBeenCalledWith(`{"money":100}`);

    })
    it("should'nt work player didnt exist",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)

        const player = new PlayerEntity(100);
        player.game = game
        await dataSource.manager.save(player);

        const parambuy = new IdsDto(game.id,"22d4db9f-9fec-4421-a4f0-f80b5681d740")


        await bankAcount({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(404);

    })

    it("should'nt work game didnt exist",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)

        const player = new PlayerEntity(100);
        player.game = game
        await dataSource.manager.save(player);

        const parambuy = new IdsDto("22d4db9f-9fec-4421-a4f0-f80b5681d740",player.id)


        await bankAcount({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(404);

    })

    it("should'nt work player not in game",async ()=> {

        const game = new GameEntity()
        await dataSource.manager.save(game)

        const player = new PlayerEntity(100);
        await dataSource.manager.save(player);

        const parambuy = new IdsDto(game.id,player.id)


        await bankAcount({ "params": parambuy} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(PlayerEntity),);

        expect(sendStatusSpy).toHaveBeenCalledWith(404);

    })


})