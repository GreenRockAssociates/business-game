import {LauncherService} from "../../libraries/launcher.service";
import {Request, Response} from "express";
import {resolvePlayerSession} from "../../api/middlewares/resolve-player-session.middleware";

class MockLauncherService {
    translateGameIdToEngineId() {
    }

    translateUserIdToPlayerIdForGame() {
    }
}

class MockResponse {
    sendStatus() {
    }
}

class Helper {
    static getValidRequest(): Request {
        return {
            headers: {echo: "echo"},
            params: {gameId: "e19a0f95-2a49-47cf-8016-d9407acc801c"}
        } as unknown as Request
    }

    static getInvalidRequest(): Request {
        return {
            headers: {echo: "echo"},
            params: {}
        } as unknown as Request
    }

    static readonly gameEngineId = "548ff2af-c4d7-457f-8bf2-dfdf9157a26a";
    static readonly playerId = "815ca062-abc5-460f-b45d-fb9b55b1035a";

    static gameEngineIdGenerator() {
        return () => this.gameEngineId
    };

    static playerIdGenerator() {
        return () => this.playerId
    };

    static errorGenerator() {
        return () => {
            throw new Error("test")
        }
    };
}

describe("Resolve player session middleware", () => {
    let mockLauncherService: LauncherService;
    let translateGameIdToEngineIdSpy: jest.SpyInstance;
    let translateUserIdToPlayerIdForGame: jest.SpyInstance;

    let responseMock: Response;
    let sendStatusSpy: jest.SpyInstance;

    let nextSpy: jest.Mock;

    beforeEach(() => {
        mockLauncherService = new MockLauncherService() as unknown as LauncherService;
        translateGameIdToEngineIdSpy = jest.spyOn(mockLauncherService, "translateGameIdToEngineId");
        translateUserIdToPlayerIdForGame = jest.spyOn(mockLauncherService, "translateUserIdToPlayerIdForGame");
        translateGameIdToEngineIdSpy.mockImplementation(Helper.gameEngineIdGenerator());
        translateUserIdToPlayerIdForGame.mockImplementation(Helper.playerIdGenerator());

        responseMock = new MockResponse() as unknown as Response;
        sendStatusSpy = jest.spyOn(responseMock, "sendStatus");

        nextSpy = jest.fn();
    })

    it("Should populate the session data", async () => {
        const req = Helper.getValidRequest();
        await resolvePlayerSession(req, responseMock, nextSpy, mockLauncherService);

        expect(nextSpy).toHaveBeenCalled();
        expect(sendStatusSpy).not.toHaveBeenCalled();
        expect(req.session).toEqual({
            gameIdInEngine: Helper.gameEngineId,
            playerId: Helper.playerId
        })
    })

    it("Should return 400 if gameId is missing", async () => {
        const req = Helper.getInvalidRequest();
        await resolvePlayerSession(req, responseMock, nextSpy, mockLauncherService);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(400);
    })

    it("Should return 400 if an error occurs during the fetching of game engine id", async () => {
        const req = Helper.getValidRequest();
        translateGameIdToEngineIdSpy.mockImplementation(Helper.errorGenerator())
        await resolvePlayerSession(req, responseMock, nextSpy, mockLauncherService);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(400);
    })

    it("Should return 400 if an error occurs during the fetching of player id", async () => {
        const req = Helper.getValidRequest();
        translateUserIdToPlayerIdForGame.mockImplementation(Helper.errorGenerator())
        await resolvePlayerSession(req, responseMock, nextSpy, mockLauncherService);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(400);
    })
})