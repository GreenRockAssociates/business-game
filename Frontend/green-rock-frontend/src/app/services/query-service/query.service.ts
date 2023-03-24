import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {PortfolioDto} from "../../interfaces/dto/portfolio.dto";
import {BankAccountDto} from "../../interfaces/dto/bank-account.dto"
import {MarketResponseDto} from "../../interfaces/dto/market-response.dto";
import {AssetDetailDto} from "../../interfaces/dto/asset-detail.dto";
import {AssetStatisticalAnalysisDto} from "../../interfaces/dto/asset-statistical-analysis.dto";
import {NewsResponseDto} from "../../interfaces/dto/news-response.dto";
import {AssetHealthDto} from "../../interfaces/dto/asset-health.dto";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPortfolio(gameId: string): Observable<PortfolioDto> {
    return this.httpClient.get<PortfolioDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/player/portfolio`, {
      withCredentials: true
    })
  }

  getPortfolioWithAssetDetail(gameId: string): Observable<{ asset: AssetDetailDto, quantity: number }[]> {
    return this.getPortfolio(gameId)
      .pipe(switchMap(response => {
        if (response.portfolio.length > 0){
          return forkJoin(response.portfolio.map(portfolioEntry =>
            this.getAssetDetail(gameId, portfolioEntry.assetId).pipe(map(assetDetail => {
              return {
                asset: assetDetail,
                quantity: portfolioEntry.quantity
              }
            }))
          ))
        }
        return of([]);
      }))
  }

  getBankAccount(gameId: string): Observable<BankAccountDto> {
    return this.httpClient.get<BankAccountDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/player/bank-account`, {
      withCredentials: true
    })
  }

  getMarketRate(gameId: string): Observable<MarketResponseDto> {
    return this.httpClient.get<MarketResponseDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/market/market-rate`, {
      withCredentials: true
    })
  }

  getAssetDetail(gameId: string, assetTicker: string): Observable<AssetDetailDto> {
    return this.httpClient.get<AssetDetailDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/market/asset/${assetTicker}`, {
      withCredentials: true
    })
  }

  getAssetAnalysis(gameId: string, assetTicker: string): Observable<AssetStatisticalAnalysisDto> {
    return this.httpClient.get<AssetStatisticalAnalysisDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/market/analysis/${assetTicker}`, {
      withCredentials: true
    })
  }

  getAllNews(gameId: string): Observable<NewsResponseDto> {
    return this.httpClient.get<NewsResponseDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/asset-health/news`, {
      withCredentials: true
    }).pipe(map(response => {
      return {
        news: response.news.sort((a, b) => b.generatedTick - a.generatedTick )
      }
    }))
  }

  getNewsForAsset(gameId: string, assetTicker: string): Observable<NewsResponseDto> {
    return this.httpClient.get<NewsResponseDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/asset-health/news/${assetTicker}`, {
      withCredentials: true
    }).pipe(map(response => {
      return {
        news: response.news.sort((a, b) => b.generatedTick - a.generatedTick )
      }
    }))
  }

  getAssetHealth(gameId: string, assetTicker: string): Observable<AssetHealthDto> {
    return this.httpClient.get<AssetHealthDto>(`${environment.baseServerUrl}${environment.queryService}/${gameId}/asset-health/health/${assetTicker}`, {
      withCredentials: true
    })
  }
}
