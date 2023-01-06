import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity} from "../../entities/game.entity";
import {InvitationEntity} from "../../entities/invitation.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {InvitePlayerRequestDto} from "../../dto/invite-player-request.dto";
import {Request, Response} from "express";
import {invitePlayer} from "../../api/routes/invite-player.route";
import {AxiosInstance} from "axios";

class ResponseMock {
    sendStatus() {}
}

class AxiosInstanceMock {
    get() {}
}

class helper {
    static getRequestObject(gameId: string, userId: string, playerEmail: string = "foo@bar.com"): Request{
        return {
            headers: {cookie: {}},
            session: {userId},
            params: new GameIdDto(gameId),
            body: new InvitePlayerRequestDto(playerEmail)
        } as unknown as Request
    }
}

describe("New game route", () => {
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

    it("Should add an invitation if every parameter is ok", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId);
        await dataSource.manager.save(game);

        const request = helper.getRequestObject(game.id, userId);
        const invitedPlayerId = "30b528ee-1a9f-44e4-96b6-208da6c94d5a";
        getSpy.mockImplementation(() => {
            return {
                data: {
                    userId: invitedPlayerId
                }
            };
        })

        await invitePlayer(request, responseMock as unknown as Response, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId: invitedPlayerId,
            gameId: game.id
        })
        expect(invitationFromDb).not.toBeNull();
        expect(invitationFromDb.acceptedInvitation).toBeFalsy();
    })
});