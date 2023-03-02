import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor() { }

  getAssetCurrentValue(assetTicker: string): number {
    return 10;
  }
}
