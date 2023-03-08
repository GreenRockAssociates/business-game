export class MarketStateDto {
  gameId: string;

  tick: number;

  marketState: [string, number][];

  constructor(gameId: string, tick: number, marketState: [string, number][]) {
    this.gameId = gameId;
    this.tick = tick;
    this.marketState = marketState;
  }

  getMarketState(): Map<string, number> {
    return new Map(this.marketState);
  }
}
