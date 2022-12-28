import {IncomingHttpHeaders} from "http";
import {UserSessionData} from "../../interfaces/session-data.interface";
import {distantSession} from "../../api/middlewares/distant-session.middleware";
import {Request, Response} from "express";
import {AuthenticationService} from "../../libraries/authentication-service";
import {AxiosError} from "axios";

class AuthenticationServiceMock {
    getSessionData(headers: IncomingHttpHeaders) {}
}

class ResponseMock {
    statusMessage: string
    sendStatus(code: number){}
}

class helpers {
    static async getSessionData(): Promise<UserSessionData> {
        return {
            userId: "ad06f2dc-0154-4e5d-bc93-ccc772c3e675"
        }
    }

    static getRequestLikeObject(): any {
        return {
            headers : {
                echo: "true"
            }
        }
    }

    static getAxiosError(code: number): AxiosError {
        return new AxiosError("", "", undefined,undefined, {
            config: undefined, data: undefined, headers: undefined, status: code, statusText: ""
        })
    }
}

describe("Distant session middleware", () => {
    let authenticationServiceMock: AuthenticationServiceMock;
    let authenticationServiceGetSessionDataSpy: jest.SpyInstance;

    let responseMock: ResponseMock;
    let responseSendStatusSpy: jest.SpyInstance;

    let nextSpy: jest.Mock;

    beforeEach(() => {
        authenticationServiceMock = new AuthenticationServiceMock();
        authenticationServiceGetSessionDataSpy = jest.spyOn(authenticationServiceMock, "getSessionData");

        responseMock = new ResponseMock();
        responseSendStatusSpy = jest.spyOn(responseMock, "sendStatus");

        nextSpy = jest.fn();
    })

    it("Should populate session object and call next if the user is connected", async () => {
        authenticationServiceGetSessionDataSpy.mockImplementation(() => helpers.getSessionData())

        const request = helpers.getRequestLikeObject();

        await distantSession(request as unknown as Request, responseMock as Response, nextSpy, authenticationServiceMock as AuthenticationService);

        expect(request.session).not.toBeUndefined();
        expect(request.session.userId).toEqual((await helpers.getSessionData()).userId);
        expect(nextSpy).toHaveBeenCalledTimes(1);
    })

    it("Should echo the request headers to AuthenticationService.getSessionData()", async () => {
        authenticationServiceGetSessionDataSpy.mockImplementation(() => helpers.getSessionData())

        await distantSession(helpers.getRequestLikeObject() as unknown as Request, responseMock as Response, nextSpy, authenticationServiceMock as AuthenticationService);

        expect(authenticationServiceGetSessionDataSpy).toHaveBeenCalledTimes(1);
        expect(authenticationServiceGetSessionDataSpy).toHaveBeenCalledWith(helpers.getRequestLikeObject().headers);
    })

    it("Should answer a code 500 if an unknown error occurs", async () => {
        authenticationServiceGetSessionDataSpy.mockImplementation(() => {throw ""})

        await distantSession(helpers.getRequestLikeObject() as unknown as Request, responseMock as Response, nextSpy, authenticationServiceMock as AuthenticationService);

        expect(responseSendStatusSpy).toHaveBeenCalledTimes(1);
        expect(responseSendStatusSpy).toHaveBeenCalledWith(500);
    })

    it("Should answer a code 500 if the error's status code is unknown", async () => {
        authenticationServiceGetSessionDataSpy.mockImplementation(() => {
            throw helpers.getAxiosError(0);
        })

        await distantSession(helpers.getRequestLikeObject() as unknown as Request, responseMock as Response, nextSpy, authenticationServiceMock as AuthenticationService);

        expect(responseSendStatusSpy).toHaveBeenCalledTimes(1);
        expect(responseSendStatusSpy).toHaveBeenCalledWith(500);
    })

    it("Should echo a code 401", async () => {
        authenticationServiceGetSessionDataSpy.mockImplementation(() => {
            throw helpers.getAxiosError(401);
        })

        await distantSession(helpers.getRequestLikeObject() as unknown as Request, responseMock as Response, nextSpy, authenticationServiceMock as AuthenticationService);

        expect(responseSendStatusSpy).toHaveBeenCalledTimes(1);
        expect(responseSendStatusSpy).toHaveBeenCalledWith(401);
    })

    it("Should echo a code 403", async () => {
        authenticationServiceGetSessionDataSpy.mockImplementation(() => {
            throw helpers.getAxiosError(403);
        })

        await distantSession(helpers.getRequestLikeObject() as unknown as Request, responseMock as Response, nextSpy, authenticationServiceMock as AuthenticationService);

        expect(responseSendStatusSpy).toHaveBeenCalledTimes(1);
        expect(responseSendStatusSpy).toHaveBeenCalledWith(403);
    })
})