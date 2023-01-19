import { Request, Response, NextFunction } from 'express';
import {plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";
import {sanitize} from "class-sanitizer";
import "reflect-metadata";

/**
 * Returns a middleware that will parse req.body to a sanitized instance of the DTO given in {dtoType}
 *
 * If req.body is invalid, sends an error 400 as response
 * @param dtoType The name of the DTO to parse to
 * @param skipMissingProperties
 */
export function requestBodyToDtoMiddlewareFactory(dtoType: any, skipMissingProperties = false){
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToInstance(dtoType, req.body, { excludeExtraneousValues: true });

        // Use try/catch block to be able to return from the function in case of error
        try {
            await validateOrReject(dto, {skipMissingProperties})
        } catch (_) {
            res.sendStatus(400);
            return;
        }

        sanitize(dto);
        req.body = dto;
        next();
    }
}