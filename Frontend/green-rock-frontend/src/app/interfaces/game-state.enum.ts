export enum GameStateEnum {
  CREATED,
  STARTED,
  ENDED
}

export function gameStateToString(gameState: GameStateEnum): string {
  switch (gameState){
    case GameStateEnum.CREATED:
      return "Created"
    case GameStateEnum.STARTED:
      return "In progress"
    case GameStateEnum.ENDED:
      return "Ended"
  }
}
