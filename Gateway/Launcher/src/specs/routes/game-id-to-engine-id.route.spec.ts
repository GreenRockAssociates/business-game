import {Request, Response} from "express";
import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity, GameState} from "../../entities/game.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {InvitationEntity} from "../../entities/invitation.entity";
import {gameIdToEngineId} from "../../api/routes/game-id-to-engine-id.route";
import {EngineIdDto} from "../../dto/engine-id.dto";

class ResponseMock {
    sendStatus() {}
    json() {}
}

class helper {
    static async insertGameAsOwner(dataSource: DataSource, userId: string, engineId: string, gameState: GameState): Promise<GameEntity> {
        const game = new GameEntity(engineId, userId, gameState);
        await dataSource.manager.save(game);

        return game;
    }

    static async insertGameAsInvited(dataSource: DataSource, userId: string, acceptedInvitation: boolean, engineId: string, gameState: GameState): Promise<GameEntity> {
        const game = new GameEntity(engineId, "02c207bc-6c10-40bd-b87f-7b40e2026609", gameState);
        await dataSource.manager.save(game);

        const invitation = new InvitationEntity(userId, acceptedInvitation);
        invitation.game = game
        await dataSource.manager.save(invitation);

        return game;
    }

    static async insertGameAsNothing(dataSource: DataSource, engineId: string, gameState: GameState): Promise<GameEntity> {
        const game = new GameEntity(engineId, "77d96c91-a214-45fa-be74-379ad1cc4607", gameState);
        await dataSource.manager.save(game);

        return game;
    }

    static getRequestObject(userId: string, gameId: string): Request{
        return {session: {userId}, params: new GameIdDto(gameId)} as unknown as Request
    }
}

describe('Translate game id to engine id route',  () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let jsonSpy: jest.SpyInstance;

    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
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
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should return the game's id if owner and game started", async () => {
        const userId = "cb427f6a-ff05-4b74-937a-f8416cd94c34";
        const engineId = "a0911cdb-fd25-4899-9596-60ef5a112916";

        const game = await helper.insertGameAsOwner(dataSource, userId, engineId, GameState.STARTED);

        await gameIdToEngineId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EngineIdDto(engineId));
    });

    it("Should return the game's id if invited and game started", async () => {
        const userId = "cb427f6a-ff05-4b74-937a-f8416cd94c34";
        const engineId = "a0911cdb-fd25-4899-9596-60ef5a112916";

        const game = await helper.insertGameAsInvited(dataSource, userId, true, engineId, GameState.STARTED);

        await gameIdToEngineId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith(new EngineIdDto(engineId));
    });

    it("Should return 412 if owner but the game hasn't started yet", async () => {
        const userId = "cb427f6a-ff05-4b74-937a-f8416cd94c34";

        const game = await helper.insertGameAsOwner(dataSource, userId, undefined, GameState.CREATED);

        await gameIdToEngineId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(412);
        expect(jsonSpy).not.toHaveBeenCalled();
    });

    it("Should return 412 if invited but the game hasn't started yet", async () => {
        const userId = "cb427f6a-ff05-4b74-937a-f8416cd94c34";

        const game = await helper.insertGameAsInvited(dataSource, userId, true, undefined, GameState.CREATED);

        await gameIdToEngineId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(412);
        expect(jsonSpy).not.toHaveBeenCalled();
    });

    it("Should return 404 if the game doesn't exist", async () => {
        const userId = "cb427f6a-ff05-4b74-937a-f8416cd94c34";

        await gameIdToEngineId(helper.getRequestObject(userId, "e8c6b1d2-3aa3-4491-a89b-95425c105eb9"), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
        expect(jsonSpy).not.toHaveBeenCalled();
    });

    it("Should return 404 if the game exists and started but not owner nor player", async () => {
        const userId = "cb427f6a-ff05-4b74-937a-f8416cd94c34";
        const engineId = "a0911cdb-fd25-4899-9596-60ef5a112916";

        const game = await helper.insertGameAsNothing(dataSource, engineId, GameState.STARTED);

        await gameIdToEngineId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
        expect(jsonSpy).not.toHaveBeenCalled();
    });

    it("Should return 404 if the game exists and not started but not owner nor player", async () => {
        const userId = "cb427f6a-ff05-4b74-937a-f8416cd94c34";

        const game = await helper.insertGameAsNothing(dataSource, undefined, GameState.CREATED);

        await gameIdToEngineId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
        expect(jsonSpy).not.toHaveBeenCalled();
    });
})