import {UserSessionData} from "../../interfaces/session-data.interface";
import "express-session";

declare module "express-session" {
    interface SessionData {
        data: UserSessionData
    }
}