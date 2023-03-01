import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {InvitationEntity} from "../../entities/invitation.entity";
import {GameEntity} from "../../entities/game.entity";
import {getUnansweredInvitations} from "../../api/routes/get-unanswered-invitations.route";
import {Request, Response} from "express";
import {AuthenticationService} from "../../libraries/authentication.service";

class ResponseMock {
    sendStatus() {}
    json() {}
}

class AuthenticationServiceMock {
    getUserEmail: jest.Mock;

    constructor() {
        this.getUserEmail = jest.fn();
        this.getUserEmail.mockImplementation(() => "a@a.com");
    }
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

    static getRequestObject(userId: string): Request{
        return {session: {userId}} as unknown as Request
    }
}

describe('Get unanswered invitations route',  () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let jsonSpy: jest.SpyInstance;

    let authenticationServiceMock: AuthenticationServiceMock;

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

        authenticationServiceMock = new AuthenticationServiceMock();
    })

    afterEach(async () => {
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should return all the invitations that haven't been accepted yet", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        const game1 = await helper.insertGameAsInvited(dataSource, userId, "a0911cdb-fd25-4899-9596-60ef5a112916", false);
        const game2 = await helper.insertGameAsInvited(dataSource, userId, "b0911cdb-fd25-4899-9596-60ef5a112917", false);

        await getUnansweredInvitations(helper.getRequestObject(userId), responseMock as unknown as Response, dataSource.getRepository(InvitationEntity), authenticationServiceMock as unknown as AuthenticationService);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith({
            invitations: [
                {
                    userId,
                    userEmail: "a@a.com",
                    gameId: game1.id,
                    acceptedInvitation: false
                },
                {
                    userId,
                    userEmail: "a@a.com",
                    gameId: game2.id,
                    acceptedInvitation: false
                }
            ]
        });
        expect(sendStatusSpy).not.toHaveBeenCalled();
    })

    it("Should not return invitations that have been accepted", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        const game1 = await helper.insertGameAsInvited(dataSource, userId, "a0911cdb-fd25-4899-9596-60ef5a112916", false);
        await helper.insertGameAsInvited(dataSource, userId, "b0911cdb-fd25-4899-9596-60ef5a112917", true);

        await getUnansweredInvitations(helper.getRequestObject(userId), responseMock as unknown as Response, dataSource.getRepository(InvitationEntity), authenticationServiceMock as unknown as AuthenticationService);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith({
            invitations: [
                {
                    userId,
                    userEmail: "a@a.com",
                    gameId: game1.id,
                    acceptedInvitation: false
                }
            ]
        });
        expect(sendStatusSpy).not.toHaveBeenCalled();
    })

    it("Should properly deal with no invitations", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        await getUnansweredInvitations(helper.getRequestObject(userId), responseMock as unknown as Response, dataSource.getRepository(InvitationEntity), authenticationServiceMock as unknown as AuthenticationService);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith({
            invitations: []
        });
        expect(sendStatusSpy).not.toHaveBeenCalled();
    })

    it("Should properly deal with only accepted invitations", async () => {
        const userId = "5e2cb3fa-71cf-4a6f-b5b6-80f71a3ba303";
        await helper.insertGameAsInvited(dataSource, userId, "b0911cdb-fd25-4899-9596-60ef5a112917", true);

        await getUnansweredInvitations(helper.getRequestObject(userId), responseMock as unknown as Response, dataSource.getRepository(InvitationEntity), authenticationServiceMock as unknown as AuthenticationService);

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(jsonSpy).toHaveBeenCalledWith({
            invitations: []
        });
        expect(sendStatusSpy).not.toHaveBeenCalled();
    })
})