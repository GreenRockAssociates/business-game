import WebSocket from "ws";

export class MarketConnectionRepository {
    marketIdToConnectionListMap: Map<string, WebSocket[]>;

    addConnectionToGame(gameId: string, connection: WebSocket){
        if (!this.marketIdToConnectionListMap.has(gameId)){
            this.marketIdToConnectionListMap.set(gameId, [])
        }

        this.marketIdToConnectionListMap.get(gameId).push(connection);
    }

    removeConnectionFromGame(gameId: string, connection: WebSocket){
        const connectionList = this.marketIdToConnectionListMap.get(gameId);
        if (connectionList){
            let index = connectionList.indexOf(connection);
            if(index !== -1) {
                connectionList.splice(index, 1);
            }
        }
    }

    getConnectionsForGame(gameId: string){
        return this.marketIdToConnectionListMap.get(gameId);
    }

    constructor() {
        this.marketIdToConnectionListMap = new Map<string, WebSocket[]>();
    }
}