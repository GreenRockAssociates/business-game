import {RabbitMqInteractor} from "../../message-broker/rabbit-mq-interactor";
import {Request, Response} from 'express';
import {GameIdDto} from "../../dto/game-id.dto";
import {validateOrReject} from "class-validator";
import {AddGameOutgoingMessageDto} from "../../dto/add-game-outgoing-message.dto";

export async function resumeGame(req: Request, res: Response, rabbitMqInteractor: RabbitMqInteractor) {
    const gameIdDto = new GameIdDto(req.params['gameId']);
    await validateOrReject(gameIdDto);

    await rabbitMqInteractor.sendToGameStartQueue(new AddGameOutgoingMessageDto(gameIdDto.gameId));
    res.sendStatus(200);
}