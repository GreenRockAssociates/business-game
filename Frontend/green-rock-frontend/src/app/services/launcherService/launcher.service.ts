import {Injectable} from '@angular/core';
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {GameDto} from "../../interfaces/game.dto";
import {GameStateEnum} from "../../interfaces/game-state.enum";
import {InvitationDto} from "../../interfaces/invitation.dto";

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
      subscriber.complete()
    })
  }

  private getAllInvitations(): Observable<InvitationDto[]> {
    return new Observable<InvitationDto[]>((subscriber) => {
      subscriber.next([
        {
          userId: "59736a25-26e7-44bf-a55c-0cc775266e0c",
          gameId: "21ad82d8-0167-4b0f-9685-e3e86286c1a2",
          acceptedInvitation: false,
        },{
          userId: "59736a25-26e7-44bf-a55c-0cc775266e0c",
          gameId: "21ad82d8-0167-4b0f-9685-e3e86286c1a2",
          acceptedInvitation: false,
        },
      ])
      subscriber.complete()
    })
  }

  getGameById(gameId: string): Observable<GameDto> {
    return new Observable<GameDto>((subscriber) => {
      subscriber.next({
        id: "2447f0ac-f99d-4527-8677-c326fb206172",
        name: "Game 1",
        gameState: GameStateEnum.CREATED,
        ownerId: "b7d42365-fec6-480d-91a7-177976f96053",
      })
      subscriber.complete()
    })
  }

  getAllInvitationsWithGameDetails(): Observable<{ invitation: InvitationDto, game: GameDto }[]> {
    // 1. pipe(switchMap()) is used to replace the observable from getAllInvitations() by the result of forkJoin()
    // 2. forkJoin() === Promise.all() : used to join all the results from the subsequent requests into a single list
    // 3. In the forkJoin(), we map each invitation to a new request where we fetch the associated game,
    //    and then map that result of that request to an objet containing both the invitation and the game
    //    from the result of the request
    return this.getAllInvitations()
      .pipe(switchMap(invitations =>
        forkJoin(invitations.map(invitation =>
          this.getGameById(invitation.gameId).pipe(map(game => {
            return {
              invitation,
              game
            }
          }))
        )))
      )
  }

  constructor() { }

  answerInvitation(invitation: InvitationDto, answer: boolean): Observable<void> {
    return of(undefined);
  }
}
