import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity, GameState} from "../../entities/game.entity";
import {InvitationEntity} from "../../entities/invitation.entity";
import {Request, Response} from "express";
import {InvitationIdentifierDto} from "../../dto/invitation-identifier.dto";
import {deleteInvitation} from "../../api/routes/delete-invitation.route";

class ResponseMock {
    sendStatus() {}
}

class AxiosInstanceMock {
    get() {}
}

class helper {
    static getRequestObject(gameId: string, userId: string, invitedUserId: string): Request{
        return {
            headers: {cookie: {}},
            session: {userId},
            params: new InvitationIdentifierDto(gameId, invitedUserId),
        } as unknown as Request
    }
}

describe("Delete invitation route", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;

    let axiosInstanceMock: AxiosInstanceMock;
    let getSpy: jest.SpyInstance;

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

        axiosInstanceMock = new AxiosInstanceMock();
        getSpy = jest.spyOn(axiosInstanceMock, 'get');
    })

    afterEach(async () => {
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should delete an invitation if every parameter is ok", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";
        const invitedUserId = "6fb277af-35d7-4eab-8ea0-ed824e5ca606";
        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId);
        await dataSource.manager.save(game);
        const invitation = new InvitationEntity(invitedUserId);
        invitation.game = game;
        await dataSource.manager.save(invitation);
        const request = helper.getRequestObject(game.id, userId, invitedUserId);

        await deleteInvitation(request, responseMock as unknown as Response, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId: invitedUserId,
            gameId: game.id
        })
        expect(invitationFromDb).toBeNull();
    })

    it("Should not delete an invitation if not the owner of the game", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";
        const invitedUserId = "6fb277af-35d7-4eab-8ea0-ed824e5ca606";
        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId);
        await dataSource.manager.save(game);
        const invitation = new InvitationEntity(invitedUserId);
        invitation.game = game;
        await dataSource.manager.save(invitation);
        const request = helper.getRequestObject(game.id, "51aeb892-c071-461d-8754-8832cffa7301", invitedUserId);

        await deleteInvitation(request, responseMock as unknown as Response, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId: invitedUserId,
            gameId: game.id
        })
        expect(invitationFromDb).not.toBeNull();
    })

    it("Should return 404 if the invitation does not exist", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";
        const invitedUserId = "6fb277af-35d7-4eab-8ea0-ed824e5ca606";
        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId);
        await dataSource.manager.save(game);
        const request = helper.getRequestObject(game.id, userId, invitedUserId);

        await deleteInvitation(request, responseMock as unknown as Response, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should delete an invitation if the game has started", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";
        const invitedUserId = "6fb277af-35d7-4eab-8ea0-ed824e5ca606";
        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId, GameState.STARTED);
        await dataSource.manager.save(game);
        const invitation = new InvitationEntity(invitedUserId);
        invitation.game = game;
        await dataSource.manager.save(invitation);
        const request = helper.getRequestObject(game.id, userId, invitedUserId);

        await deleteInvitation(request, responseMock as unknown as Response, dataSource.getRepository(InvitationEntity));

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(412);

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId: invitedUserId,
            gameId: game.id
        })
        expect(invitationFromDb).not.toBeNull();
    })
});