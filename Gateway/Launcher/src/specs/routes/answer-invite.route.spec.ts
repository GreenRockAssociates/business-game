import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity, GameState} from "../../entities/game.entity";
import {InvitationEntity} from "../../entities/invitation.entity";
import {AnswerInviteDto} from "../../dto/answer-invite.dto";
import {answerInvite} from "../../api/routes/answer-invite.route";
import {Request, Response} from "express";

class ResponseMock {
    sendStatus() {}
}

class helper {
    static async insertGameAsInvited(dataSource: DataSource, userId: string, gameEngineId: string, acceptedInvitation: boolean): Promise<GameEntity> {
        const game = new GameEntity(gameEngineId, "02c207bc-6c10-40bd-b87f-7b40e2026609");
        await dataSource.manager.save(game);

        const invitation = new InvitationEntity(userId, acceptedInvitation);
        invitation.game = game
        await dataSource.manager.save(invitation);

        return game;
    }

    static getRequestObject(userId: string, gameId: string, accept: boolean): Request{
        return {session: {userId}, body: new AnswerInviteDto(gameId, accept)} as unknown as Request
    }
}

describe('Answer invitation route',  () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;

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
    })

    afterEach(async () => {
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should change the status of the invitation if the game hasn't started and the invitation is not accepted yet ", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        const game = await helper.insertGameAsInvited(dataSource, userId, "a0911cdb-fd25-4899-9596-60ef5a112916", false);

        await answerInvite(helper.getRequestObject(userId, game.id, true), responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity));

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId,
            gameId: game.id
        })
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(invitationFromDb.acceptedInvitation).toBeTruthy();
    })

    it("Should not change the status of the invitation if it has been accepted before", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        const game = await helper.insertGameAsInvited(dataSource, userId, "a0911cdb-fd25-4899-9596-60ef5a112916", true);

        await answerInvite(helper.getRequestObject(userId, game.id, false), responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity));

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId,
            gameId: game.id
        })
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        expect(invitationFromDb.acceptedInvitation).toBeTruthy();
    })

    it("Should return 404 if the game does not exist", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";

        await answerInvite(helper.getRequestObject(userId, "3d73cbf2-31af-4889-8809-fb0f37538563", true), responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if the invitation does not exist", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        const game = new GameEntity("f1c10c0f-33ce-40e6-a53c-99d234dd0c42", "02c207bc-6c10-40bd-b87f-7b40e2026609");
        await dataSource.manager.save(game);

        await answerInvite(helper.getRequestObject(userId, game.id, true), responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 412 if the game has already started", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        const game = new GameEntity("f1c10c0f-33ce-40e6-a53c-99d234dd0c42", "02c207bc-6c10-40bd-b87f-7b40e2026609", GameState.STARTED);
        await dataSource.manager.save(game);
        const invitation = new InvitationEntity(userId, false);
        invitation.game = game
        await dataSource.manager.save(invitation);

        await answerInvite(helper.getRequestObject(userId, game.id, true), responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(412);
    })

    it("Should return 412 if the game has already ended", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        const game = new GameEntity("f1c10c0f-33ce-40e6-a53c-99d234dd0c42", "02c207bc-6c10-40bd-b87f-7b40e2026609", GameState.ENDED);
        await dataSource.manager.save(game);
        const invitation = new InvitationEntity(userId, false);
        invitation.game = game
        await dataSource.manager.save(invitation);

        await answerInvite(helper.getRequestObject(userId, game.id, true), responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(412);
    })
})