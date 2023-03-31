import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {MarketStateDto} from "../../interfaces/dto/market-state.dto";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {environment} from "../../../environments/environment";
import {QueryService} from "../query-service/query.service";
import {MarketResponseDto} from "../../interfaces/dto/market-response.dto";
import {AssetMarketStateEntry} from "../../interfaces/asset-market-state-entry";

@Injectable({
  providedIn: 'root'
})
export class MarketService implements OnDestroy {

  private webSocketSubject: WebSocketSubject<MarketStateDto> | null = null;
  private marketStateSubjectMap: Map<string, BehaviorSubject<AssetMarketStateEntry[]>> | null = null;

  constructor(
    private queryService: QueryService
  ) {}

  establishConnection(gameId: string): Observable<void> {
    if (this.marketStateSubjectMap || this.webSocketSubject) {
      throw new Error("A connection already exists");
    }

    return new Observable<void>(subscriber => {
      this.queryService.getMarketRate(gameId).subscribe({
        next: initialMarketState => {
          this.marketStateSubjectMap = this.initializeMarketStateSubjectMap(initialMarketState)
          subscriber.complete();
        }
      })

      this.webSocketSubject = this.marketWebSocketFactory(gameId);
    })
  }

  private initializeMarketStateSubjectMap(initialMarketState: MarketResponseDto): Map<string, BehaviorSubject<AssetMarketStateEntry[]>> {
    const marketStateMap = new Map<string, BehaviorSubject<AssetMarketStateEntry[]>>();

    initialMarketState.market
      .sort((a, b) => a.tick - b.tick) // Make sure the values are next'ed in the right order
      .forEach(marketEntry => {
        const ticker = marketEntry.assetId;

        if (!marketStateMap.get(ticker)) {
          marketStateMap.set(ticker, this.marketEntrySubjectFactory())
        }

        this.pushToListSubjectEnd(marketStateMap.get(marketEntry.assetId), {tick: marketEntry.tick, value: marketEntry.value});
      })

    return marketStateMap;
  }

  private marketEntrySubjectFactory(): BehaviorSubject<AssetMarketStateEntry[]> {
    return new BehaviorSubject<AssetMarketStateEntry[]>([]);
  }

  private marketWebSocketFactory(gameId: string): WebSocketSubject<MarketStateDto> {
    const ws: WebSocketSubject<MarketStateDto> = webSocket(`${environment.webSocketUrl}/${gameId}`);

    // Subscribe with the necessary steps to parse and handle the messages on the websocket
    ws.pipe(
      map(
        marketState => new MarketStateDto(marketState.gameId, marketState.tick, marketState.marketState)
      )
    ).subscribe({
      next: marketState => marketState
        .getMarketState()
        .forEach((assetValue, assetTicker) => {
          this.pushToListSubjectEnd(this.marketStateSubjectMap?.get(assetTicker), {tick: marketState.tick, value: assetValue});
        })
    })

    return ws;
  }

  /**
   * Takes a BehaviorSubject than emits a list, and makes it emit its latest list with `value` appended at the end
   * @param subject
   * @param value
   * @private
   */
  private pushToListSubjectEnd<T>(subject: BehaviorSubject<T[]> | undefined, value: T): void {
    if (subject){
      const list: T[] = subject.getValue();
      list.push(value)
      subject.next(list);
    }
  }

  closeConnection() {
    this.webSocketSubject?.complete();
    this.marketStateSubjectMap?.forEach(value => value.complete());
    this.webSocketSubject = null;
    this.marketStateSubjectMap = null;
  }

  getMarketMap(): Map<string, BehaviorSubject<AssetMarketStateEntry[]>> | null {
    return this.marketStateSubjectMap;
  }

  getAssetList(): string[] {
    return Array.from(this.marketStateSubjectMap!.keys());
  }

  /**
   * Returns a BehaviorSubject that will emit the whole market for `assetTicker` every time a new entry is available
   * @param assetTicker
   */
  getMarketObservableForAsset(assetTicker: string): BehaviorSubject<AssetMarketStateEntry[]> | undefined {
    return this.marketStateSubjectMap?.get(assetTicker);
  }

  /**
   * Returns an observable that emits the latest value for the market of `assetTicker` when available
   * @param assetTicker
   */
  getValueObservableForAsset(assetTicker: string): Observable<AssetMarketStateEntry> | undefined {
    return this.getMarketObservableForAsset(assetTicker)?.pipe(map(marketObservable => marketObservable[marketObservable.length - 1]))
  }

  /**
   * Synchronously returns the latest value for the requested asset
   * @param assetTicker
   */
  getAssetCurrentValue(assetTicker: string): number {
    const assetMarket = this.marketStateSubjectMap?.get(assetTicker)?.getValue() ?? undefined;
    if (!assetMarket) {
      return 0;
    }
    return assetMarket[assetMarket.length - 1].value;
  }

  ngOnDestroy(): void {
    this.closeConnection();
  }
}
