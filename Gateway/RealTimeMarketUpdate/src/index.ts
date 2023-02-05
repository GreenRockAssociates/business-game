import dotenv from 'dotenv';
import {MarketUpdatesWebSocketServer} from "./web-socket/market-updates-web-socket-server";
dotenv.config({path: __dirname + '/.env'});

new MarketUpdatesWebSocketServer();