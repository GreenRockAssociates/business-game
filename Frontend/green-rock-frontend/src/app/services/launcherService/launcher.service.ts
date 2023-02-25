import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {GameDto} from "../../interfaces/game.dto";
import {GameStateEnum} from "../../interfaces/game-state.enum";

@Injectable({
  providedIn: 'root'
})
export class LauncherService {

  getAllGames(): Observable<GameDto[]> {
    return new Observable<GameDto[]>((subscriber) => {
      subscriber.next([
        {
          id: "2447f0ac-f99d-4527-8677-c326fb206172",
          name: "Game 1",
          gameState: GameStateEnum.CREATED,
          ownerId: "59736a25-26e7-44bf-a55c-0cc775266e0c",
        },
        {
          id: "96620287-be82-498a-aeec-bfb04b712cb0",
          name: "Game 2",
          gameState: GameStateEnum.STARTED,
          ownerId: "59736a25-26e7-44bf-a55c-0cc775266e0c",
        },
        {
          id: "197e83ae-69f1-4c2c-9380-f03562f14ecc",
          name: "Game 3",
          gameState: GameStateEnum.ENDED,
          ownerId: "b7d42365-fec6-480d-91a7-177976f96053",
        },
      ])
    })
  }

  constructor() { }
}
