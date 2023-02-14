export class GameRepository {
    games: string[] = [];

    addGame(gameId: string){
        this.games.push(gameId);
    }

    removeGame(gameId: string){
        this.games.splice(this.games.indexOf(gameId), 1);
    }

    getAllGames(): string[] {
        // Return a copy of the array and not the array itself
        return this.games.map(i => i);
    }
}