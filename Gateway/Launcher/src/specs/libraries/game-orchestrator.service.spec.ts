import {GameOrchestratorService} from "../../libraries/game-orchestrator.service";
import {AxiosInstance} from "axios";
import {NewGameResponseDto} from "../../dto/new-game-response.dto";

class AxiosMock {
    post() {}
}

class Helper {
    static readonly gameEngineId = "1265627e-83cb-4a70-959f-dd14464ef85e"
    static readonly playerIds = ["14fc6b62-cc73-4130-bb46-198af7c1bb5d", "ecd556b1-363c-4b5c-9fbc-52b254b8e939"]

    static getAPIResponse(gameEngineId: string = Helper.gameEngineId, playerIds: string[] = Helper.playerIds){
        return {data: new NewGameResponseDto(gameEngineId, playerIds)}
    }
}

describe("Game orchestrator service", () => {
    let gameOrchestratorService: GameOrchestratorService;
    let axiosMock: AxiosMock;
    let axiosPostSpy: jest.SpyInstance;

    beforeEach(() => {
        axiosMock = new AxiosMock();
        axiosPostSpy = jest.spyOn(axiosMock, "post");
        gameOrchestratorService = new GameOrchestratorService(axiosMock as unknown as AxiosInstance);
    })

    it("Should call the right URL with the right parameters", async () => {
        axiosPostSpy.mockImplementation(() => Helper.getAPIResponse())

        await gameOrchestratorService.startGame(2);

        expect(axiosPostSpy).toHaveBeenCalledWith(
            `${process.env.BASE_SERVER_URL}${process.env.ORCHESTRATOR_SERVICE_PREFIX}/new-game`,
            {numberOfPlayers: 2}
        )
    })

    it("Should let caller handle errors", async () => {
        axiosPostSpy.mockImplementation(() => {throw new Error("Test")});

        await expect(gameOrchestratorService.startGame(2)).rejects.not.toBeUndefined();
    })

    it("Should return the value in the response", async () => {
        axiosPostSpy.mockImplementation(() => Helper.getAPIResponse())

        const newGameResponseDto = await gameOrchestratorService.startGame(2);

        expect(newGameResponseDto.playerIds).toEqual(Helper.playerIds);
        expect(newGameResponseDto.gameEngineId).toEqual(Helper.gameEngineId);
    })

    it("Should validate the value in the response", async () => {
        axiosPostSpy.mockImplementation(() => Helper.getAPIResponse("Not a uuid", Helper.playerIds))
        await expect(gameOrchestratorService.startGame(2)).rejects.not.toBeUndefined();
    })
})