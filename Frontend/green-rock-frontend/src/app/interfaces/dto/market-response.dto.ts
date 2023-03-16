export interface MarketResponseDto {
  market: MarketEntryDto[]
}

export interface MarketEntryDto {
  assetId: string;
  tick: number;
  value: number;
  tradable: boolean;
}
