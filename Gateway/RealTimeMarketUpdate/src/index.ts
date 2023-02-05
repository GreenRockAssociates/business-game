import dotenv from 'dotenv';
import {MarketUpdatesWebSocketServer} from "./web-socket/MarketUpdatesWebSocketServer";
dotenv.config({path: __dirname + '/.env'});

new MarketUpdatesWebSocketServer();