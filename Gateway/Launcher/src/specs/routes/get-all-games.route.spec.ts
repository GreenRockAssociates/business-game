import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity, GameState} from "../../entities/game.entity";
import {InvitationEntity} from "../../entities/invitation.entity";
import {getAllGames} from "../../api/routes/get-all-games.route";
import {Request, Response} from "express";
import {GameDto} from "../../dto/game.dto";

class ResponseMock {
    sendStatus() {}
    status() {}
    send() {}
}

class helper {
    static getRequestWithSession(userId: string): Request{
        return {session: {userId: userId}} as Request
    }
}

describe('Get all games route', () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let statusSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;

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
        sendSpy = jest.spyOn(responseMock, 'send');
    })

    afterEach(async () => {
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should return an empty list if the user has no game", async () => {
        const userId = "3ac4d14f-51ce-49f5-bcaa-db5e66e4ff31";
        await getAllGames(helper.getRequestWithSession(userId), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendSpy).toHaveBeenCalledTimes(1)
        const returnedGames = JSON.parse(sendSpy.mock.lastCall)['games']
        expect(returnedGames.length).toBe(0)
    })
    
    it("Should return all games where the user is the owner", async () => {
        const userId = "3ac4d14f-51ce-49f5-bcaa-db5e66e4ff31";

        const game1 = new GameEntity("4e66668c-df65-4088-bcb8-cb3807fd1fc3", userId, GameState.CREATED, "Game number one");
        const game2 = new GameEntity("6b5cf5e6-b4f3-412e-b2d1-820dc87eefe3", userId, GameState.STARTED, "Game number two");

        await dataSource.manager.save(game1);
        await dataSource.manager.save(game2);

        await getAllGames(helper.getRequestWithSession(userId), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendSpy).toHaveBeenCalledTimes(1)
        const returnedGames = JSON.parse(sendSpy.mock.lastCall)['games']
        expect(returnedGames.length).toBe(2)
        const gameIds: string[] = returnedGames.map((game: GameDto) => game.id)
        expect(gameIds).toContain(game1.id)
        expect(gameIds).toContain(game2.id)
    })

    it("Should return all games where the user is a player", async () => {
        const userId = "3ac4d14f-51ce-49f5-bcaa-db5e66e4ff31";

        const game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", "f4c5b4d9-94a7-4841-8546-25bf0b044e02");
        await dataSource.manager.save(game);

        const invitation = new InvitationEntity(userId, true);
        invitation.game = game
        await dataSource.manager.save(invitation);

        await getAllGames(helper.getRequestWithSession(userId), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendSpy).toHaveBeenCalledTimes(1)
        const returnedGames = JSON.parse(sendSpy.mock.lastCall)['games']
        expect(returnedGames.length).toBe(1)
        expect(returnedGames[0].id).toEqual(game.id)
    })

    it("Should not return games where the user hasn't accepted the invitation", async () => {
        const userId = "3ac4d14f-51ce-49f5-bcaa-db5e66e4ff31";

        const game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", "f4c5b4d9-94a7-4841-8546-25bf0b044e02");
        await dataSource.manager.save(game);

        const invitation = new InvitationEntity(userId, false);
        invitation.game = game
        await dataSource.manager.save(invitation);

        await getAllGames(helper.getRequestWithSession(userId), responseMock as unknown as Response, dataSource.getRepository(GameEntity));

        expect(sendSpy).toHaveBeenCalledTimes(1)
        const returnedGames = JSON.parse(sendSpy.mock.lastCall)['games']
        expect(returnedGames.length).toBe(0)
    })

    test("Invitations property of the DTO should not be set", async () => {
        const userId = "3ac4d14f-51ce-49f5-bcaa-db5e66e4ff31";

        // Test when user is the owner of the game
        const game1 = new GameEntity("4e66668c-df65-4088-bcb8-cb3807fd1fc3", userId);
        await dataSource.manager.save(game1);
        const invitation1 = new InvitationEntity("1e19aaf6-1cda-40fe-a77b-c788d41ec4fe", true);
        invitation1.game = game1
        await dataSource.manager.save(invitation1);

        // Test when user is invited
        const game2 = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", "f4c5b4d9-94a7-4841-8546-25bf0b044e02");
        await dataSource.manager.save(game2);
        const invitation2 = new InvitationEntity(userId, true);
        invitation2.game = game2
        await dataSource.manager.save(invitation2);

        await getAllGames(helper.getRequestWithSession(userId), responseMock as unknown as Response, dataSource.getRepository(GameEntity));
        expect(sendSpy).toHaveBeenCalledTimes(1)
        const returnedGames = JSON.parse(sendSpy.mock.lastCall)['games']
        expect(returnedGames.length).toBe(2)
        returnedGames.forEach((game: GameDto) => {
            expect(game.invitations).toBeUndefined()
        })
    })
});