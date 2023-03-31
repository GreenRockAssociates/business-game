export interface NewsResponseDto {
  news: NewsReportDto[]
}

export interface NewsReportDto {
  id: string;
  generatedTick: number;
  title: string;
  content: string;
}
