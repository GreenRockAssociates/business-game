import { Request, Response, NextFunction } from 'express';
import {GetGameDetailRequestDto} from "../../dto/get-game-detail-request.dto";
import {requestParamsToDtoMiddlewareFactory} from "../../api/middlewares/request-params-to-dto.middleware";
import {Trim} from "class-sanitizer";
import {IsString} from "class-validator";
import {Expose} from "class-transformer";

describe('RequestParamsToDtoMiddlewareFactory', () => {
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

    it('The middleware should parse object literal to class instance', async () => {
        const request = {
            params : {
                gameId: "fc672170-766c-4471-a74f-e33316f2260d"
            }
        }

        const middleware = requestParamsToDtoMiddlewareFactory(GetGameDetailRequestDto);
        await middleware(request as unknown as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(request.params instanceof GetGameDetailRequestDto).toEqual(true);
        expect(request.params.gameId).toEqual("fc672170-766c-4471-a74f-e33316f2260d");
    })

    it('The middleware should sanitize the inputs', async () => {
        class TrimMe {
            @Trim()
            @IsString()
            @Expose()
            value: string
        }

        const request = {
            params : {
                value: "  Foo  "
            }
        }

        const expected = {
            value: "Foo"
        }

        const middleware = requestParamsToDtoMiddlewareFactory(TrimMe);
        await middleware(request as unknown as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(request.params).toEqual(expected);
    })

    it('The middleware should call the next() function if the object is valid', async () => {
        const request = {
            params : {
                gameId: "fc672170-766c-4471-a74f-e33316f2260d"
            }
        }

        const middleware = requestParamsToDtoMiddlewareFactory(GetGameDetailRequestDto);
        await middleware(request as unknown as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(nextSpy).toHaveBeenCalled();
        expect(responseSpy).not.toHaveBeenCalled();
    })

    it('The middleware should call the sendStatus() function with error code 400 if the object is invalid', async () => {
        const request = {
            params : {
                gameId: "not a uuid"
            }
        }

        const middleware = requestParamsToDtoMiddlewareFactory(GetGameDetailRequestDto);
        await middleware(request as unknown as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(400);
    })

    it('Should handle empty params and call the sendStatus() function with error code 400', async () => {
        const request = {
            params : {}
        }

        const middleware = requestParamsToDtoMiddlewareFactory(GetGameDetailRequestDto);
        await middleware(request as unknown as Request, response as unknown as Response, nextSpy as NextFunction);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(responseSpy).toHaveBeenCalledWith(400);
    })
})