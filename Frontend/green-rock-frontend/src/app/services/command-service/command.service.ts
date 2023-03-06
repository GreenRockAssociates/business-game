import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private httpClient: HttpClient
  ) { }

  buyAsset(gameId: string, assetId: string, quantity: number): Observable<void> {
    return of(undefined);
  }

  sellAsset(gameId: string, assetId: string, quantity: number): Observable<void> {
    return of(undefined);
  }
}
