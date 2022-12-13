import { Request, Response } from 'express';
import {csrfProtection} from "../../api/middlewares/csrf-protection.middleware";

class RequestStub {
    method: string;
    cookies: object;
    header: (name: string) => string;

    constructor(method: string, cookies: object, header: (name: string) => string) {
        this.method = method;
        this.cookies = cookies;
        this.header = header;
    }
}

describe("CSRF protection middleware", () => {
    const response = {
        sendStatus() {},
        cookie() {}
    };
    let responseSpy: jest.SpyInstance;
    let cookieSpy: jest.SpyInstance;
    let nextSpy: jest.Mock;

    beforeAll(() => {
        responseSpy = jest.spyOn(response, 'sendStatus');
        cookieSpy = jest.spyOn(response, 'cookie');
        nextSpy = jest.fn();
    })

    afterEach(() => {
        jest.clearAllMocks();
        nextSpy.mockClear();
    })

    it('Should call next function if the csrf cookie matches the header', () => {
        const request = new RequestStub("POST", {'XSRF-TOKEN': 'token'}, () => 'token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    it('Should call next function even if the csrf cookie does not match the header for GET requests', () => {
        const request = new RequestStub("GET", {'XSRF-TOKEN': 'token'}, () => 'not token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    it('Should call next function even if the csrf cookie does not match the header for OPTIONS requests', () => {
        const request = new RequestStub("OPTIONS", {'XSRF-TOKEN': 'token'}, () => 'not token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    it('Should call next function even if the csrf cookie does not match the header for HEAD requests', () => {
        const request = new RequestStub("HEAD", {'XSRF-TOKEN': 'token'}, () => 'not token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    it('Should not call next function if the cookie and header do not match for POST', () => {
        const request = new RequestStub("POST", {'XSRF-TOKEN': 'token'}, () => 'not token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(403);
    })

    it('Should not call next function if the cookie and header do not match for PUT', () => {
        const request = new RequestStub("PUT", {'XSRF-TOKEN': 'token'}, () => 'not token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(403);
    })

    it('Should not call next function if the cookie and header do not match for DELETE', () => {
        const request = new RequestStub("DELETE", {'XSRF-TOKEN': 'token'}, () => 'not token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(403);
    })

    it('Should not call next function if the cookie and header do not match for PATCH', () => {
        const request = new RequestStub("PATCH", {'XSRF-TOKEN': 'token'}, () => 'not token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(403);
    })

    it('Should not call next function if the cookie is not present', () => {
        const request = new RequestStub("POST", {}, () => 'token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(403);
    })

    it('Should not call next function if the header is not present', () => {
        const request = new RequestStub("POST", {'XSRF-TOKEN': 'token'}, () => undefined);

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(403);
    })

    it('Should not care if the cookie is not present on non-mutating methods', () => {
        const request = new RequestStub("GET", {}, () => 'token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    it('Should not care if the header is not present on non-mutating methods', () => {
        const request = new RequestStub("GET", {'XSRF-TOKEN': 'token'}, () => undefined);

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(nextSpy).toHaveBeenCalled();
        expect(cookieSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    test("The cookie should be named 'XSRF-TOKEN'", () => {
        const request = new RequestStub("POST", {'XSRF-TOKEN': 'token'}, () => 'token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(cookieSpy).toHaveBeenCalledTimes(1);
        const cookie = cookieSpy.mock.calls[0]

        expect(cookie[0]).toEqual('XSRF-TOKEN')
    })

    test("The cookie should be properly configured", () => {
        const request = new RequestStub("POST", {'XSRF-TOKEN': 'token'}, () => 'token');

        csrfProtection(request as Request, response as unknown as Response, nextSpy);

        expect(cookieSpy).toHaveBeenCalledTimes(1);
        const cookie = cookieSpy.mock.calls[0]

        expect(cookie[2]).toEqual({
            maxAge: 60*60*1000, // 1 hour
            secure: true,
            sameSite: true
        })
    })
})