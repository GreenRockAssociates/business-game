import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {Request, Response} from "express";
import {GameEntity, GameState} from "../../entities/game.entity";
import {InvitationEntity} from "../../entities/invitation.entity";
import {UserIdTranslationEntity} from "../../entities/user-id-translation.entity";
import {startGame} from "../../api/routes/start-game.route";
import {GameOrchestratorService} from "../../libraries/game-orchestrator.service";
import {NewGameResponseDto} from "../../dto/new-game-response.dto";

class ResponseMock {
    sendStatus() {}
}

class GameOrchestratorMock {
    startGame() {}
}

class helper {
    static async insertGameAsOwner(dataSource: DataSource, userId: string): Promise<GameEntity> {
        const game = new GameEntity(undefined, userId);
        await dataSource.manager.save(game);

        return game;
    }

    static async insertGameAsNothing(dataSource: DataSource): Promise<GameEntity> {
        const game = new GameEntity(undefined, "77d96c91-a214-45fa-be74-379ad1cc4607");
        await dataSource.manager.save(game);

        return game;
    }

    static async addInvitedUser(dataSource: DataSource, game: GameEntity, userId: string, acceptedInvitation: boolean){
        const invitation = new InvitationEntity(userId, acceptedInvitation);
        invitation.game = game
        await dataSource.manager.save(invitation);
    }

    static getRequestObject(userId: string, gameId: string): Request{
        return {session: {userId}, params: {gameId}} as unknown as Request
    }

    static readonly gameEngineId = "1265627e-83cb-4a70-959f-dd14464ef85e";
    static readonly playerIds = ["14fc6b62-cc73-4130-bb46-198af7c1bb5d", "ecd556b1-363c-4b5c-9fbc-52b254b8e939", "23ebe00c-154f-4261-a6ab-6f17b7940a9f", "05d7ca7d-bb07-46d7-bd67-2ec0ec40fa68", "dcaaea2d-8e84-4ec7-8b66-3b75d76cf80e"];

    static getGameOrchestratorResponse(numberOfPlayers: number) : NewGameResponseDto {
        return new NewGameResponseDto(helper.gameEngineId, helper.playerIds.slice(0, numberOfPlayers))
    }
}

describe("Start game route", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;

    let gameOrchestratorMock: GameOrchestratorMock;
    let startGameSpy: jest.SpyInstance;

    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        await dataSource.getRepository(UserIdTranslationEntity).delete({});
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        responseMock = new ResponseMock()
        sendStatusSpy = jest.spyOn(responseMock, 'sendStatus');

        gameOrchestratorMock = new GameOrchestratorMock();
        startGameSpy = jest.spyOn(gameOrchestratorMock, "startGame");
    })

    afterEach(async () => {
        await dataSource.getRepository(UserIdTranslationEntity).delete({});
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    const userId = "3196d7fd-37ac-49ed-9ee8-f88bef9d5c2e";

    it("Should change the game state if the engine manages to create the game", async () => {
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1));
        const game = await helper.insertGameAsOwner(dataSource, userId);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        const gameFromDb = await dataSource.getRepository(GameEntity).findOneBy({
            id: game.id
        })

        expect(gameFromDb.gameState).toEqual(GameState.STARTED);
    })

    it("Should add the game engineId if the engine manages to create the game", async () => {
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1));
        const game = await helper.insertGameAsOwner(dataSource, userId);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        const gameFromDb = await dataSource.getRepository(GameEntity).findOneBy({
            id: game.id
        })

        expect(gameFromDb.engineId).toEqual(helper.gameEngineId);
    })

    it("Should add the translation keys if the engine manages to create the game", async () => {
        const firstInvitedPlayerId = "878db562-6cbf-4fe4-877a-34d6996a193d";
        const secondInvitedPlayerId = "221b3c1d-f6bc-41af-b820-5b3d2c2d2604";
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(3));

        const game = await helper.insertGameAsOwner(dataSource, userId);
        await helper.addInvitedUser(dataSource, game, firstInvitedPlayerId, true);
        await helper.addInvitedUser(dataSource, game, secondInvitedPlayerId, true);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        const gameFromDb: GameEntity = await dataSource.getRepository(GameEntity).findOne({
            where: {
                id: game.id,
            },
            relations: {
                userIds: true
            }
        })

        expect(gameFromDb.userIds.length).toEqual(3);
        expect(gameFromDb.userIds).toContainEqual(new UserIdTranslationEntity(firstInvitedPlayerId, helper.playerIds[0], game.id));
        expect(gameFromDb.userIds).toContainEqual(new UserIdTranslationEntity(secondInvitedPlayerId, helper.playerIds[1], game.id));
        expect(gameFromDb.userIds).toContainEqual(new UserIdTranslationEntity(userId, helper.playerIds[2], game.id)); // The owner is added last
    })

    it("Should call Game Orchestrator service with the right number of players", async () => {
        const firstInvitedPlayerId = "878db562-6cbf-4fe4-877a-34d6996a193d";
        const secondInvitedPlayerId = "221b3c1d-f6bc-41af-b820-5b3d2c2d2604";
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(3));

        const game = await helper.insertGameAsOwner(dataSource, userId);
        await helper.addInvitedUser(dataSource, game, firstInvitedPlayerId, true);
        await helper.addInvitedUser(dataSource, game, secondInvitedPlayerId, true);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        expect(startGameSpy)
    })

    it("Should return 200 if the game starts properly", async () => {
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1));
        const game = await helper.insertGameAsOwner(dataSource, userId);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
    })

    it("Should return 200 if the game has already started", async () => {
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1));
        const game = await helper.insertGameAsOwner(dataSource, userId);
        game.gameState = GameState.STARTED;
        await dataSource.manager.save(game);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
    })

    it("Should return 200 if the game has already ended", async () => {
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1));
        const game = await helper.insertGameAsOwner(dataSource, userId);
        game.gameState = GameState.ENDED;
        await dataSource.manager.save(game);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
    })

    it("Should return 404 if the game does not exist", async () => {
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1));

        await startGame(helper.getRequestObject(userId, "69f25da4-b7da-4357-95b6-e14a6b055c16"), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if the user is not the game owner", async () => {
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1));
        const game = await helper.insertGameAsNothing(dataSource);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 500 and not modify anything if an error occurs in the engine", async () => {
        startGameSpy.mockImplementation(() => {throw new Error("test")});
        const game = await helper.insertGameAsOwner(dataSource, userId);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        const gameFromDb: GameEntity = await dataSource.getRepository(GameEntity).findOne({
            where: {
                id: game.id,
            },
            relations: {
                userIds: true
            }
        })

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(500);
        expect(gameFromDb.gameState).toEqual(GameState.CREATED);
        expect(gameFromDb.engineId).toBeNull();
        expect(gameFromDb.userIds.length).toEqual(0);
    })

    it("Should return 500 if there are less player ids returned by the engine than actual players", async () => {
        const firstInvitedPlayerId = "878db562-6cbf-4fe4-877a-34d6996a193d";
        const secondInvitedPlayerId = "221b3c1d-f6bc-41af-b820-5b3d2c2d2604";
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(1)); // Tell mock service to not return enough player ids

        const game = await helper.insertGameAsOwner(dataSource, userId);
        await helper.addInvitedUser(dataSource, game, firstInvitedPlayerId, true);
        await helper.addInvitedUser(dataSource, game, secondInvitedPlayerId, true);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(500);
    })

    it("Should only count the players that have accepted the invitation when calculating the number of players", async () => {
        const firstInvitedPlayerId = "878db562-6cbf-4fe4-877a-34d6996a193d";
        const secondInvitedPlayerId = "221b3c1d-f6bc-41af-b820-5b3d2c2d2604";
        startGameSpy.mockImplementation(() => helper.getGameOrchestratorResponse(2));

        const game = await helper.insertGameAsOwner(dataSource, userId);
        await helper.addInvitedUser(dataSource, game, firstInvitedPlayerId, true);
        await helper.addInvitedUser(dataSource, game, secondInvitedPlayerId, false);

        await startGame(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(GameEntity), gameOrchestratorMock as unknown as GameOrchestratorService);

        const gameFromDb: GameEntity = await dataSource.getRepository(GameEntity).findOne({
            where: {
                id: game.id,
            },
            relations: {
                userIds: true
            }
        })

        expect(gameFromDb.userIds.length).toEqual(2);
    })
})