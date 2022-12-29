import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {InvitationEntity} from "../../entities/invitation.entity";
import {GameEntity} from "../../entities/game.entity";
import {Request, Response} from "express";
import {getGame} from "../../api/routes/get-game.route";
import {InvitationDto} from "../../dto/invitation.dto";

class ResponseMock {
    sendStatus() {}
    status() {}
    json() {}
}

class helper {
    static async insertGameAsOwner(dataSource: DataSource, userId: string): Promise<GameEntity> {
        const game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", userId);
        await dataSource.manager.save(game);

        return game;
    }

    static async insertGameAsInvited(dataSource: DataSource, userId: string, acceptedInvitation: boolean = true): Promise<GameEntity> {
        const game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", "02c207bc-6c10-40bd-b87f-7b40e2026609");
        await dataSource.manager.save(game);

        const invitation = new InvitationEntity(userId, acceptedInvitation);
        invitation.game = game
        await dataSource.manager.save(invitation);

        return game;
    }

    static async insertGameAsNothing(dataSource: DataSource): Promise<GameEntity> {
        const game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", "77d96c91-a214-45fa-be74-379ad1cc4607");
        await dataSource.manager.save(game);

        return game;
    }

    static getRequestObject(userId: string, gameId: string): Request{
        return {session: {userId}, params: {gameId}} as unknown as Request
    }
}

describe('Get game route',  () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let statusSpy: jest.SpyInstance;
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
        statusSpy = jest.spyOn(responseMock, 'status');
        jsonSpy = jest.spyOn(responseMock, 'json');
    })

    afterEach(async () => {
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should return the game with all details if the id is valid and player is the owner", async () => {
        const userId = "c84c0eea-f3d8-4a2f-b6f0-ab40b89039fd";
        const game = await helper.insertGameAsOwner(dataSource, userId);

        await getGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(statusSpy).toHaveBeenCalledTimes(1)
        expect(statusSpy).toHaveBeenCalledWith(200)
        expect(jsonSpy).toHaveBeenCalledTimes(1)
        const {ownerId, invitations, name, id, gameState} = jsonSpy.mock.calls[0][0];
        expect(id).toEqual(game.id);
        expect(ownerId).toEqual(game.ownerId);
        expect(name).toEqual(game.name);
        expect(gameState).toEqual(game.gameState);
        expect(invitations).toEqual([]);
    })

    it("Should return code 404 if the id doesn't exist even if the player is the owner", async () => {
        const userId = "c84c0eea-f3d8-4a2f-b6f0-ab40b89039fd";
        await helper.insertGameAsOwner(dataSource, userId);

        await getGame(helper.getRequestObject(userId, "5215ef28-d2c2-489a-ab72-61f2a427f9a7"), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(404)
    })

    it("Should return the game with all details if the id is valid and player is invited", async () => {
        const userId = "c84c0eea-f3d8-4a2f-b6f0-ab40b89039fd";
        const game = await helper.insertGameAsInvited(dataSource, userId);

        await getGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(statusSpy).toHaveBeenCalledTimes(1)
        expect(statusSpy).toHaveBeenCalledWith(200)
        expect(jsonSpy).toHaveBeenCalledTimes(1)
        const {ownerId, invitations, name, id, gameState} = jsonSpy.mock.calls[0][0];
        expect(id).toEqual(game.id);
        expect(ownerId).toEqual(game.ownerId);
        expect(name).toEqual(game.name);
        expect(gameState).toEqual(game.gameState);
        expect(invitations).toEqual([new InvitationDto(userId, true)]);
    })

    it("Should return code 404 if the id doesn't exist even if the player is invited", async () => {
        const userId = "c84c0eea-f3d8-4a2f-b6f0-ab40b89039fd";
        await helper.insertGameAsInvited(dataSource, userId);

        await getGame(helper.getRequestObject(userId, "5215ef28-d2c2-489a-ab72-61f2a427f9a7"), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(404)
    })

    it("Should return code 404 if the id is valid but the player is not related to the game", async () => {
        const userId = "c84c0eea-f3d8-4a2f-b6f0-ab40b89039fd";
        const game = await helper.insertGameAsNothing(dataSource);

        await getGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(404)
    })

    it("Should return code 404 if there is no game", async () => {
        await getGame(helper.getRequestObject("0738a06a-f43e-4bad-bc61-58eff224b9aa", "2986a1b0-acec-4c40-8367-00d3252a0746"), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(404)
    })

    it("Should return code 400 if the game id is missing", async () => {
        const userId = "c84c0eea-f3d8-4a2f-b6f0-ab40b89039fd";
        await helper.insertGameAsOwner(dataSource, userId);

        await getGame(helper.getRequestObject(userId, undefined), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(400)
    })

    it("Should return code 400 if the game id is invalid", async () => {
        await getGame(helper.getRequestObject("de3c58ac-39d1-44d3-acea-96727e2827e9", "not a uuid"), responseMock as unknown as Response, dataSource.getRepository(GameEntity))

        expect(sendStatusSpy).toHaveBeenCalledTimes(1)
        expect(sendStatusSpy).toHaveBeenCalledWith(400)
    })
});