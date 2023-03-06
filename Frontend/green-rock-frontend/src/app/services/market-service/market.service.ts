import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor() { }

  getAssetCurrentValue(assetTicker: string): number {
    return 10;
  }

  getAssetValueObservable(assetTicker: string): Observable<number> {
    return new Observable<number>(subscriber => {
      setInterval(() => {
        subscriber.next(Math.floor(Math.random() * 100))
      }, 1000)
    })
  }
}
