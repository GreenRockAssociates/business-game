import {guardAuthenticated} from "../../api/middlewares/guard-authenticated.middleware";
import { Request, Response } from 'express';

describe("Guard authenticated middleware", () => {
    const response = {
        sendStatus() {}
    };
    let responseSpy: jest.SpyInstance;
    let nextSpy: jest.Mock;

    beforeAll(() => {
        responseSpy = jest.spyOn(response, 'sendStatus');
        nextSpy = jest.fn();
    })

    afterEach(() => {
        jest.clearAllMocks();
        nextSpy.mockClear();
    })

    it('Should call next() if the request contains valid session data', () => {
        const request = {
            session : {
                data : {
                    userId: "uuid"
                }
            }
        };

        guardAuthenticated(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
    })

    it('Should return 401 if the request does not contain valid session data', () => {
        const request: { session: { data: undefined } } = {
            session : {
                data: undefined
            }
        };

        guardAuthenticated(request as unknown as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(401);
    })
})