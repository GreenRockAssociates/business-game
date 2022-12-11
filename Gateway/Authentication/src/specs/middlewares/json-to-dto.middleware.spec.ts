import {jsonToDtoMiddlewareFactory} from "../../api/middlewares/json-to-dto.middleware";
import {RegisterUserDto} from "../../dto/register-user.dto";
import { Request, Response, NextFunction } from 'express';

describe('jsonToDtoMiddlewareFactory', () => {
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

    it('The middleware should parses object literal to class instance', async () => {
        const request = {
            body : {
                firstName: "Foo",
                lastName: "Bar",
                email: "foo@bar.com",
                password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            }
        }

        const middleware = jsonToDtoMiddlewareFactory(RegisterUserDto);
        await middleware(request as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(request.body instanceof RegisterUserDto).toEqual(true);
    })

    it('The middleware should sanitize the inputs', async () => {
        const request = {
            body : {
                firstName: "  Foo  ",
                lastName: "  Bar  ",
                email: "fOo@bAr.com",
                password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            }
        }

        const expected = {
            firstName: "Foo",
            lastName: "Bar",
            email: "foo@bar.com",
            password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        }

        const middleware = jsonToDtoMiddlewareFactory(RegisterUserDto);
        await middleware(request as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(request.body).toEqual(expected);
    })

    it('The middleware should call the next() function if the object is valid', async () => {
        const request = {
            body : {
                firstName: "Foo",
                lastName: "Bar",
                email: "foo@bar.com",
                password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            }
        }

        const middleware = jsonToDtoMiddlewareFactory(RegisterUserDto);
        await middleware(request as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(nextSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    it('The middleware should call the sendStatus() function with error code 400 if the object is invalid', async () => {
        // Only check one kind of invalidity ; each dto should have its own tests for every kind of invalidity it has
        const request = {
            body : {
                firstName: "Foo",
                lastName: "Bar",
                email: "foo@bar.com",
                password: ""
            }
        }

        const middleware = jsonToDtoMiddlewareFactory(RegisterUserDto);
        await middleware(request as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(400);
    })

    it('Should handle empty body and call the sendStatus() function with error code 400', async () => {
        // Only check one kind of invalidity ; each dto should have its own tests for every kind of invalidity it has
        const request = {
            body : {}
        }

        const middleware = jsonToDtoMiddlewareFactory(RegisterUserDto);
        await middleware(request as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(400);
    })
})