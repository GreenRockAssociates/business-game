import {disconnect} from "../../api/routes/disconnect.route";
import {Request, Response} from "express";


describe("Disconnect route", () => {
    const response = {
        sendStatus() {}
    };
    let responseSpy: jest.SpyInstance;

    const session: { destroy(callback: () => void): void } = {
        destroy(callback: () => void){callback()},
    }
    let sessionDestroySpy: jest.SpyInstance;

    beforeAll(async () => {
        responseSpy = jest.spyOn(response, 'sendStatus');
        sessionDestroySpy = jest.spyOn(session, 'destroy');
    })

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it("Should return 200 when destroying succeeds", () => {
        disconnect({session} as Request, response as unknown as Response);

        expect(responseSpy).toHaveBeenCalledWith(200);
        expect(responseSpy).toHaveBeenCalledTimes(1);
        expect(sessionDestroySpy).toHaveBeenCalled();
    })

    it("Should return 500 when destroying fails", () => {
        const session: { destroy(callback: (err: string) => void): void } = {
            destroy(callback: (err: string) => void){callback("This is an error.")},
        }
        const sessionDestroySpy = jest.spyOn(session, 'destroy');

        disconnect({session} as Request, response as unknown as Response);

        expect(responseSpy).toHaveBeenCalledWith(500);
        expect(responseSpy).toHaveBeenCalledTimes(1);
        expect(sessionDestroySpy).toHaveBeenCalled();
    })
})