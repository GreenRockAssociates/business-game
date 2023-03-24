import {Injectable} from '@angular/core';
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {GameDto} from "../../interfaces/dto/game.dto";
import {InvitationDto} from "../../interfaces/dto/invitation.dto";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LauncherService {

  getAllGames(): Observable<GameDto[]> {
    return this.httpClient.get<{games: GameDto[]}>(`${environment.baseServerUrl}${environment.launcherService}/games`, {
      withCredentials: true
    }).pipe(map(response => response.games));
  }

  private getAllInvitations(): Observable<InvitationDto[]> {
    return this.httpClient.get<{invitations: InvitationDto[]}>(`${environment.baseServerUrl}${environment.launcherService}/invites`, {
      withCredentials: true
    }).pipe(map(response => response.invitations));
  }

  getGameById(gameId: string): Observable<GameDto> {
    return this.httpClient.get<GameDto>(`${environment.baseServerUrl}${environment.launcherService}/games/${gameId}`, {
      withCredentials: true
    });
  }

  getAllInvitationsWithGameDetails(): Observable<{ invitation: InvitationDto, game: GameDto }[]> {
    // 1. pipe(switchMap()) is used to replace the observable from getAllInvitations() by the result of forkJoin()
    // 2. forkJoin() === Promise.all() : used to join all the results from the subsequent requests into a single list
    // 3. In the forkJoin(), we map each invitation to a new request where we fetch the associated game,
    //    and then map that result of that request to an objet containing both the invitation and the game
    //    from the result of the request
    return this.getAllInvitations()
      .pipe(switchMap(invitations => {
        if (invitations.length > 0){
          return forkJoin(invitations.map(invitation =>
            this.getGameById(invitation.gameId).pipe(map(game => {
              return {
                invitation,
                game
              }
            }))
          ))
        }
        return of([]);
      }))
  }

  answerInvitation(invitation: InvitationDto, answer: boolean): Observable<void> {
    return this.httpClient.put(`${environment.baseServerUrl}${environment.launcherService}/invites`, {
      gameId: invitation.gameId,
      accept: answer
    }, {
      withCredentials: true,
      responseType: "text"
    }).pipe(map(_ => undefined));
  }

  deleteInvitation(invitation: InvitationDto): Observable<void> {
    return this.httpClient.delete(`${environment.baseServerUrl}${environment.launcherService}/games/${invitation.gameId}/invite/${invitation.userId}`, {
      withCredentials: true,
      responseType: "text"
    }).pipe(map(_ => undefined));
  }

  addInvitation(gameId: string, email: string): Observable<void> {
    return this.httpClient.put(`${environment.baseServerUrl}${environment.launcherService}/games/${gameId}/invite`, {
      userEmail: email
    }, {
      withCredentials: true,
      responseType: "text"
    }).pipe(map(_ => undefined));
  }

  createGame(name: string): Observable<void> {
    return this.httpClient.post(`${environment.baseServerUrl}${environment.launcherService}/new-game`, {
      name
    }, {
      withCredentials: true,
      responseType: "text"
    }).pipe(map(_ => undefined));
  }

  startGame(gameId: string): Observable<void> {
    return this.httpClient.put(`${environment.baseServerUrl}${environment.launcherService}/games/${gameId}/start`, {}, {
      withCredentials: true,
      responseType: "text"
    }).pipe(map(_ => undefined));
  }

  constructor(
    private httpClient: HttpClient
  ) { }
}
