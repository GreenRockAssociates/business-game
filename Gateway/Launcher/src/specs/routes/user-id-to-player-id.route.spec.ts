import {Request, Response} from "express";
import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {UserIdTranslationEntity} from "../../entities/user-id-translation.entity";
import {GameEntity} from "../../entities/game.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {userIdToPlayerId} from "../../api/routes/user-id-to-player-id.route";
import {EngineIdDto} from "../../dto/engine-id.dto";
import {InvitationEntity} from "../../entities/invitation.entity";

class ResponseMock {
    sendStatus() {}
    json() {}
}

class helper {
    static async insertGame(dataSource: DataSource): Promise<GameEntity> {
        const game = new GameEntity("9541d530-0a8b-43e0-be9f-c6edd66263cc", "02c207bc-6c10-40bd-b87f-7b40e2026609");
        await dataSource.manager.save(game);

        return game;
    }

    static async insertTranslationEntity(dataSource: DataSource, game: GameEntity, userId: string, playerId: string){
        const translationEntity = new UserIdTranslationEntity(userId, playerId);
        translationEntity.game = game;
        await dataSource.manager.save(translationEntity);

        return translationEntity;
    }

    static getRequestObject(userId: string, gameId: string): Request{
        return {session: {userId}, params: new GameIdDto(gameId)} as unknown as Request
    }
}

describe('Get unanswered invitations route',  () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;
    let jsonSpy: jest.SpyInstance;

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
        jsonSpy = jest.spyOn(responseMock, 'json');
    })

    afterEach(async () => {
        await dataSource.getRepository(UserIdTranslationEntity).delete({});
        await dataSource.getRepository(InvitationEntity).delete({});
        await dataSource.getRepository(GameEntity).delete({});
    })

    it("Should return the right id", async () => {
        const userId = "57a6197f-c67a-4924-af97-5cffeb5f7775";
        const playerId = "a20b48ce-b363-46a9-8d5b-2018b7f85ce0";
        const game = await helper.insertGame(dataSource);
        await helper.insertTranslationEntity(dataSource, game, userId, playerId);

        await userIdToPlayerId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(UserIdTranslationEntity));

        expect(jsonSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).toHaveBeenCalledWith(new EngineIdDto(playerId));
    })

    it("Should return 404 if the translation key does not exist", async () => {
        const userId = "57a6197f-c67a-4924-af97-5cffeb5f7775";
        const game = await helper.insertGame(dataSource);

        await userIdToPlayerId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(UserIdTranslationEntity));

        expect(jsonSpy).not.toHaveBeenCalled();
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 404 if a translation key exists for another player", async () => {
        const userId = "57a6197f-c67a-4924-af97-5cffeb5f7775";
        const playerId = "a20b48ce-b363-46a9-8d5b-2018b7f85ce0";
        const game = await helper.insertGame(dataSource);
        await helper.insertTranslationEntity(dataSource, game, "cea626a3-80d4-431b-b23d-3b3d386d7d76", playerId);

        await userIdToPlayerId(helper.getRequestObject(userId, game.id), responseMock as unknown as Response, dataSource.getRepository(UserIdTranslationEntity));

        expect(jsonSpy).not.toHaveBeenCalled();
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })
})