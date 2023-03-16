import {plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";
import {sanitize} from "class-sanitizer";
import {ConsumeMessage} from "amqplib";

export function bindDtoToListener(dtoType: any, callback: Function){
    return async (message: ConsumeMessage) => {
        const plain: object = JSON.parse(message.content.toString());
        const dto: object = plainToInstance(dtoType, plain, { excludeExtraneousValues: true });
        await validateOrReject(dto, {skipMissingProperties: false});
        sanitize(dto);
        return callback(dto);
    }
}