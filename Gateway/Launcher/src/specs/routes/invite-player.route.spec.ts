import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity, GameState} from "../../entities/game.entity";
import {InvitationEntity} from "../../entities/invitation.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {UserEmailDto} from "../../dto/user-email.dto";
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
            body: new UserEmailDto(playerEmail)
        } as unknown as Request
    }
}

describe("Invite player route", () => {
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

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId: invitedPlayerId,
            gameId: game.id
        })
        expect(invitationFromDb).not.toBeNull();
        expect(invitationFromDb.acceptedInvitation).toBeFalsy();
    })

    it("A player should not be able to invite themselves", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId);
        await dataSource.manager.save(game);

        const request = helper.getRequestObject(game.id, userId);
        const invitedPlayerId = userId;
        getSpy.mockImplementation(() => {
            return {
                data: {
                    userId: invitedPlayerId
                }
            };
        })

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(412);
    })

    it("Should return 404 if the user is not the owner of the game", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", "12dacac9-5cd5-4cf3-a6e6-25814db958a9");
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

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);

        const invitationFromDb = await dataSource.getRepository(InvitationEntity).findOneBy({
            userId: invitedPlayerId,
            gameId: game.id
        })
        expect(invitationFromDb).toBeNull();
    })

    it("Should return 404 if the game doesn't exist", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const request = helper.getRequestObject("12dacac9-5cd5-4cf3-a6e6-25814db958a9", userId);
        const invitedPlayerId = "30b528ee-1a9f-44e4-96b6-208da6c94d5a";
        getSpy.mockImplementation(() => {
            return {
                data: {
                    userId: invitedPlayerId
                }
            };
        })

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 412 if the game has started", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId, GameState.STARTED);
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

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(412);
    })

    it("Should return 404 if the player email is not linked to an id", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId, GameState.STARTED);
        await dataSource.manager.save(game);

        const request = helper.getRequestObject(game.id, userId);
        getSpy.mockImplementation(() => {
            return {
                data: {
                    userId: undefined
                }
            };
        })

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if the response from the authentication service is invalid", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId, GameState.STARTED);
        await dataSource.manager.save(game);

        const request = helper.getRequestObject(game.id, userId);
        getSpy.mockImplementation(() => {
            return {
                data: {
                    userId: "not a uuid"
                }
            };
        })

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if an error occurs when contacting the authentication service", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", userId, GameState.STARTED);
        await dataSource.manager.save(game);

        const request = helper.getRequestObject(game.id, userId);
        getSpy.mockImplementation(() => {
            throw new Error('test')
        })

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if the provided user email is not actually an email", async () => {
        const userId = "0979d995-4dfb-4bcb-8fe9-fdddaa0472cd";

        const game = new GameEntity("df5390c5-6671-4cc9-a915-68a9c040f576", "12dacac9-5cd5-4cf3-a6e6-25814db958a9");
        await dataSource.manager.save(game);

        const request = helper.getRequestObject(game.id, userId, "not an email");
        const invitedPlayerId = "30b528ee-1a9f-44e4-96b6-208da6c94d5a";
        getSpy.mockImplementation(() => {
            return {
                data: {
                    userId: invitedPlayerId
                }
            };
        })

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Inviting a player should be idempotent", async () => {
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

        const invitation = new InvitationEntity(invitedPlayerId, true)
        invitation.game = game;
        await dataSource.manager.save(invitation);

        await invitePlayer(request, responseMock as unknown as Response, () => {}, dataSource.getRepository(InvitationEntity), dataSource.getRepository(GameEntity), axiosInstanceMock as unknown as AxiosInstance);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);

        const invitationsFromDb = await dataSource.getRepository(InvitationEntity).findBy({
            userId: invitedPlayerId,
            gameId: game.id
        })
        expect(invitationsFromDb.length).toEqual(1); // Verify that there wasn't two insertions
        const invitationFromDb = invitationsFromDb[0];
        expect(invitationFromDb).not.toBeNull();
        expect(invitationFromDb.acceptedInvitation).toBeTruthy(); // Verify that we didn't modify the status
    })
});