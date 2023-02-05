import {WebSocketServer} from "ws";

export class MarketUpdatesWebSocketServer {
    port: number;
    wss: WebSocketServer;


    private registerListenersForServerListeningEvent() {
        this.wss.on('listening', () => {
            console.log(`Real time update service listening on port ${this.port}`);
        });
    }

    private registerListenersForServerConnectionEvent() {
        this.wss.on('connection', (ws, request) => {

        });
    }

    private registerServerEventListeners() {
        this.registerListenersForServerListeningEvent();
        this.registerListenersForServerConnectionEvent();
    }

    constructor(port: number = parseInt(process.env.APP_PORT)) {
        this.port = port;
        this.wss = new WebSocketServer({port: this.port});

        this.registerServerEventListeners();
    }
}