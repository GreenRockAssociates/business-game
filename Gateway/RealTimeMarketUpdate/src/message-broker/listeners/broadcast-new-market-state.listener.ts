import {MarketStateIncomingMessageDto} from "../../dto/market-state-incoming-message.dto";
import {MarketConnectionRepository} from "../../web-socket/market-connection-repository";
import WebSocket from "ws";
import {instanceToPlain} from "class-transformer";

export function broadcastNewMarketStateListenerFactory(marketConnectionRepository: MarketConnectionRepository){
    return async (message: MarketStateIncomingMessageDto) => {
        const gameId: string = message.gameId;

        const connections: WebSocket[] = marketConnectionRepository.getConnectionsForGame(gameId);

        connections.forEach(connection => {
            connection.send(JSON.stringify(instanceToPlain(message)));
        })
    }
}