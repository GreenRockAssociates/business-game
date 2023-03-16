export interface PortfolioDto {
  portfolio: PortfolioEntryDto[]
}

export interface PortfolioEntryDto {
  assetId: string;
  quantity: number;
}
