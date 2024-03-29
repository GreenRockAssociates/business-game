import {WebSocketServer} from "ws";
import {connectionRequestToSessionDataListenerFactory} from "./listeners/connection-request-to-session-data.listener";
import {LauncherService} from "../libraries/launcher.service";
import {MarketConnectionRepository} from "./market-connection-repository";

export class MarketUpdatesWebSocketServer {
    port: number;
    wss: WebSocketServer;

    private registerServerEventListeners(marketConnectionRepository: MarketConnectionRepository) {
        this.wss.on('listening', () => {
            console.log(`Real time update service listening on port ${this.port}`);
        });

        const launcherService = new LauncherService();
        this.wss.on('connection', connectionRequestToSessionDataListenerFactory(launcherService, marketConnectionRepository));
    }

    constructor(marketConnectionRepository: MarketConnectionRepository, port: number = parseInt(process.env.APP_PORT)) {
        this.port = port;
        this.wss = new WebSocketServer({port: this.port});

        this.registerServerEventListeners(marketConnectionRepository);
    }
}