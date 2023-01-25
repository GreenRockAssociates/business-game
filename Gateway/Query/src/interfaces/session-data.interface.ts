/**
 * This is not information about a user's session, but about a *player's* session. Meaning that it is the information of a user in a specific game
 */
export interface PlayerSessionData {
    gameIdInEngine: string;
    playerId: string;
}