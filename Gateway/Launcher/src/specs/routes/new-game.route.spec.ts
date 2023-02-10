import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity, GameState} from "../../entities/game.entity";
import {Request, Response} from "express";
import {CreateGameRequestDto} from "../../dto/create-game-request.dto";
import {newGame} from "../../api/routes/new-game.route";

class ResponseMock {
    sendStatus() {}
}

class helper {
    static getRequestObject(userId: string, gameName: string): Request{
        return {session: {userId}, body: new CreateGameRequestDto(gameName)} as unknown as Request
    }
}

describe("New game route", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;

    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        await dataSource.getRepository(GameEntity).delete({});
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        responseMock = new ResponseMock()
        sendStatusSpy = jest.spyOn(responseMock, 'sendStatus');
    })

    afterEach(async () => {
        await dataSource.getRepository(GameEntity).delete({});
    })

    it('Should create a game if a name is provided', async () => {
        const userId = "fa39092b-fbab-43da-bc60-7976907aaa18";
        const gameName = "Game";
        await newGame(helper.getRequestObject(userId, gameName), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        const gameFromDB = (await dataSource.getRepository(GameEntity).find({relations: {invitations: true, userIds: true}}))[0];

        expect(gameFromDB).not.toBeUndefined();
        expect(gameFromDB.ownerId).toEqual(userId);
        expect(gameFromDB.name).toEqual(gameName);
        expect(gameFromDB.gameState).toEqual(GameState.CREATED);
        expect(gameFromDB.invitations).toEqual([]);
        expect(gameFromDB.userIds).toEqual([]);
    })

    it('Should send code 200 if insertion succeeds', async () => {
        const userId = "fa39092b-fbab-43da-bc60-7976907aaa18";
        const gameName = "Game";
        await newGame(helper.getRequestObject(userId, gameName), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(200)
    })

    it('Should not insert if game name is empty', async () => {
        const userId = "fa39092b-fbab-43da-bc60-7976907aaa18";
        const gameName = "";
        await newGame(helper.getRequestObject(userId, gameName), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        const dbResponse = await dataSource.getRepository(GameEntity).find({relations: {invitations: true, userIds: true}});

        expect(dbResponse).toEqual([])
        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(500)
    })
})