import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private httpClient: HttpClient
  ) { }

  buyAsset(gameId: string, assetId: string, quantity: number): Observable<void> {
    return this.httpClient.post(`${environment.baseServerUrl}${environment.commandService}/${gameId}/player/buy`, {
      assetId,
      quantity
    }, {
      withCredentials: true,
      responseType: "text"
    }).pipe(map(_ => undefined));
  }

  sellAsset(gameId: string, assetId: string, quantity: number): Observable<void> {
    return this.httpClient.post(`${environment.baseServerUrl}${environment.commandService}/${gameId}/player/sell`, {
      assetId,
      quantity
    }, {
      withCredentials: true,
      responseType: "text"
    }).pipe(map(_ => undefined));
  }
}
