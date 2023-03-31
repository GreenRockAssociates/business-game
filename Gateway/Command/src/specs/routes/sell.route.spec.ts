import {PlayerStateService} from "../../libraries/player-state.service";
import {NextFunction, Request, Response} from "express";
import {BuySellInternalRequestDto} from "../../dto/buy-sell-internal-request.dto";
import {PlayerSessionData} from "../../interfaces/session-data.interface";
import {AxiosError} from "axios";
import {sellRouteFactory} from "../../api/routes/player-state/sell.route";

class MockPlayerStateService {
    sell() {
    }
}

class MockResponse {
    sendStatus() {
    }
}

class Helper {
    static readonly playerId = "e73454de-952b-4aec-b9bf-179dee4852a3";
    static readonly gameEngineId = "fd34375e-a37b-4541-a138-e4f6fdc0c4da";
    static readonly assetTicker = "APPL";
    static readonly quantity = 10;

    static getValidSession(): PlayerSessionData {
        return {
            playerId: this.playerId,
            gameIdInEngine: this.gameEngineId
        }
    }

    static getValidBody(): BuySellInternalRequestDto {
        return new BuySellInternalRequestDto(this.playerId, this.assetTicker, this.quantity)
    }

    static getValidRequest(): Request {
        return {
            body: this.getValidBody(),
            session: this.getValidSession()
        } as unknown as Request;
    }
}

describe("Sell route", () => {
    let mockPlayerStateService: PlayerStateService;
    let sellSpy: jest.SpyInstance;

    let mockResponse: Response;
    let sendStatusSpy: jest.SpyInstance;

    let sellRoute: (req: Request, res: Response, next: NextFunction) => Promise<void>

    beforeEach(() => {
        mockPlayerStateService = new MockPlayerStateService() as unknown as PlayerStateService;
        sellSpy = jest.spyOn(mockPlayerStateService, "sell")

        mockResponse = new MockResponse() as unknown as Response;
        sendStatusSpy = jest.spyOn(mockResponse, "sendStatus");

        sellRoute = sellRouteFactory(mockPlayerStateService);
    })

    it("Should return 200 on correct parameters", async () => {
        const request = Helper.getValidRequest();

        await sellRoute(request, mockResponse, () => {});

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(200);
    })

    it("Should return 400 on invalid request", async () => {
        const request = Helper.getValidRequest();
        request.body = new BuySellInternalRequestDto("", "", -1)

        await sellRoute(request, mockResponse, () => {});

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(400);
    })

    it("Should echo error codes from the backend", async () => {
        const request = Helper.getValidRequest();
        sellSpy.mockImplementation(() => {throw new AxiosError("", "404", undefined, undefined, {
            config: undefined,
            data: undefined,
            headers: undefined,
            statusText: "",
            status: 404}
        )})

        await sellRoute(request, mockResponse, () => {});

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(404);
    })

    it("Should return 500 in case of unknown error", async () => {
        const request = Helper.getValidRequest();
        sellSpy.mockImplementation(() => {throw new Error("test")})

        await sellRoute(request, mockResponse, () => {});

        expect(sendStatusSpy).toHaveBeenCalledTimes(1);
        expect(sendStatusSpy).toHaveBeenCalledWith(500);
    })

    it("Should pass the correct parameters to PlayerStateService", async () => {
        const request = Helper.getValidRequest();

        await sellRoute(request, mockResponse, () => {});

        expect(sellSpy).toHaveBeenCalledTimes(1);
        expect(sellSpy).toHaveBeenCalledWith(Helper.getValidSession(), Helper.getValidBody());
    })
})