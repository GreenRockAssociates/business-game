export class GameRepository {
    games: string[] = [];

    addGame(gameId: string){
        this.games.push(gameId);
    }

    removeGame(gameId: string){
        this.games.splice(this.games.indexOf(gameId), 1);
    }
}