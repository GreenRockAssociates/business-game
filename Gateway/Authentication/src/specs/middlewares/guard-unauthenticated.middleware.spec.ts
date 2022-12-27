import {guardUnauthenticated} from "../../api/middlewares/guard-unauthenticated.middleware";
import { Request, Response } from 'express';

describe("Guard unauthenticated middleware", () => {
    const response = {
        sendStatus() {},
        statusMessage: ""
    };
    let responseSpy: jest.SpyInstance;
    let nextSpy: jest.Mock;

    beforeAll(() => {
        responseSpy = jest.spyOn(response, 'sendStatus');
        nextSpy = jest.fn();
    })

    afterEach(() => {
        response.statusMessage = "";
        jest.clearAllMocks();
        nextSpy.mockClear();
    })

    it('Should call next() if the request does not contain session data', () => {
        const request: { session: { data: undefined } } = {
            session : {
                data: undefined
            }
        };

        guardUnauthenticated(request as unknown as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
    })

    it('Should return 401 if the request contains session data', () => {
        const request = {
            session : {
                data : {
                    userId: "uuid"
                }
            }
        };

        guardUnauthenticated(request as unknown as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(401);
        expect(response.statusMessage).toEqual("Already authenticated");
    })
})