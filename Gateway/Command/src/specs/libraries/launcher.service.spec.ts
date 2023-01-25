import {AxiosInstance} from "axios";
import {IncomingHttpHeaders} from "http";
import {LauncherService} from "../../libraries/launcher.service";

class AxiosMock {
    get () {}
}

class Helper {
    static getValidHeaders(): IncomingHttpHeaders {
        return {cookie: "connect.sid=s%3AAPV3iI9ACXRxL1pXNkBqdHk12tb_YMN7.ojrh%2FUePwF3YBIlgCBeJp6sChHpbghjO782AsR58qGA"}
    }

    static getInvdalidHeaders(): IncomingHttpHeaders {
        return {}
    }

    static readonly gameEngineId = "a8a8c4f4-11f3-48e2-8542-374ce4bca076"
    static validGameEngineIdResponseFactory(): () => { data: { engineId: string } } {
        return () => {
            return {
                data: {
                    engineId: this.gameEngineId
                }
            }
        }
    }

    static invalidGameEngineIdResponseFactory(): () => { data: { engineId: string } } {
        return () => {
            return {
                data: {
                    engineId: "Not a uuid"
                }
            }
        }
    }
    static readonly playerEngineId = "5d4382a9-221b-4ba6-9fc3-9c2697a5e033"
    static validPlayerIdResponseFactory(): () => { data: { engineId: string } } {
        return () => {
            return {
                data: {
                    engineId: this.playerEngineId
                }
            }
        }
    }

    static invalidPlayerIdResponseFactory(): () => { data: { engineId: string } } {
        return () => {
            return {
                data: {
                    engineId: "Not a uuid"
                }
            }
        }
    }
}

describe("Launcher service", () => {
    let axiosMock: AxiosInstance;
    let getSpy: jest.SpyInstance;

    let launcherService: LauncherService;

    beforeEach(() => {
        axiosMock = new AxiosMock() as unknown as AxiosInstance;
        getSpy = jest.spyOn(axiosMock, "get");

        launcherService = new LauncherService(axiosMock);
    })

    describe("translateGameIdToEngineId", () => {
        it("Should call the right URL and echo the cookie header", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getValidHeaders();
            getSpy.mockImplementation(Helper.validGameEngineIdResponseFactory())

            await launcherService.translateGameIdToEngineId(gameId, headers);

            expect(getSpy).toHaveBeenCalledTimes(1);
            expect(getSpy).toHaveBeenCalledWith(
                `${process.env.BASE_SERVER_URL}${process.env.LAUNCHER_SERVICE_PREFIX}/games/${gameId}/engine-id`,
                {headers}
            )
        })

        it("Should return the value from the distant server", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getValidHeaders();
            getSpy.mockImplementation(Helper.validGameEngineIdResponseFactory())

            const engineId = await launcherService.translateGameIdToEngineId(gameId, headers);

            expect(engineId).toEqual(Helper.gameEngineId);
        })

        it("Should throw if the distant response is invalid", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getInvdalidHeaders();
            getSpy.mockImplementation(Helper.invalidGameEngineIdResponseFactory())

            await expect(launcherService.translateGameIdToEngineId(gameId, headers)).rejects.not.toBeUndefined();
        });

        it("Should throw if the distant response causes an error", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getInvdalidHeaders();
            getSpy.mockImplementation(() => {throw new Error("Test")})

            await expect(launcherService.translateGameIdToEngineId(gameId, headers)).rejects.not.toBeUndefined();
        });
    })

    describe("translateUserIdToPlayerIdForGame", () => {
        it("Should call the right URL and echo the cookie header", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getValidHeaders();
            getSpy.mockImplementation(Helper.validPlayerIdResponseFactory())

            await launcherService.translateUserIdToPlayerIdForGame(gameId, headers);

            expect(getSpy).toHaveBeenCalledTimes(1);
            expect(getSpy).toHaveBeenCalledWith(
                `${process.env.BASE_SERVER_URL}${process.env.LAUNCHER_SERVICE_PREFIX}/games/${gameId}/players/engine-id`,
                {headers}
            )
        })

        it("Should return the value from the distant server", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getValidHeaders();
            getSpy.mockImplementation(Helper.validPlayerIdResponseFactory())

            const engineId = await launcherService.translateUserIdToPlayerIdForGame(gameId, headers);

            expect(engineId).toEqual(Helper.playerEngineId);
        })

        it("Should throw if the distant response is invalid", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getInvdalidHeaders();
            getSpy.mockImplementation(Helper.invalidPlayerIdResponseFactory())

            await expect(launcherService.translateUserIdToPlayerIdForGame(gameId, headers)).rejects.not.toBeUndefined();
        });

        it("Should throw if the distant response causes an error", async () => {
            const gameId = "a0fc3418-1501-401b-b5e8-771ee7587a8e";
            const headers = Helper.getInvdalidHeaders();
            getSpy.mockImplementation(() => {throw new Error("Test")})

            await expect(launcherService.translateUserIdToPlayerIdForGame(gameId, headers)).rejects.not.toBeUndefined();
        });
    })
})