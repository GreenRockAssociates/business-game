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

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPortfolio(gameId: string): Observable<PortfolioDto> {
    return of({
      portfolio: [
        {assetId: "APPL", quantity: 10},
        {assetId: "MSFT", quantity: 5.55}
      ]
    });
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
    return of({
      money: 2000
    });
  }

  getMarketRate(gameId: string): Observable<MarketResponseDto> {
    return of({
      market: [
        {assetId: "APPL", tick: 1, value: 10, tradable: true},
        {assetId: "MSFT", tick: 1, value: 10, tradable: true},
        {assetId: "APPL", tick: 2, value: 10.5, tradable: true},
        {assetId: "MSFT", tick: 2, value: 10.2, tradable: true},
        {assetId: "APPL", tick: 3, value: 11, tradable: true},
        {assetId: "MSFT", tick: 3, value: 10, tradable: true},
        {assetId: "APPL", tick: 4, value: 10.7, tradable: true},
        {assetId: "MSFT", tick: 4, value: 9.4, tradable: true},
        {assetId: "APPL", tick: 5, value: 10, tradable: true},
        {assetId: "MSFT", tick: 5, value: 10, tradable: true},
      ]
    })
  }

  getAssetDetail(gameId: string, assetTicker: string): Observable<AssetDetailDto> {
    return of({
      assetTicker,
      name: assetTicker === "APPL" ? "Apple" : "Microsoft",
      description: "A tech company",
      logo: "logo.png",
      sectors: ["Technology", "Lorem", "Ipsum"]
    })
  }

  getAssetAnalysis(gameId: string, assetTicker: string): Observable<AssetStatisticalAnalysisDto> {
    return of({})
  }

  getAllNews(gameId: string): Observable<NewsResponseDto> {
    return of({
      news: [
        {id: "13c84d0d-cd5d-4309-a889-ccc5d92845d5", generatedTick: 1, title: "La France désignée pour accueillir les prochains Jeux Olympiques.", content: "Après de nombreux débats, La France a réussit à faire accepter sa candidature comme pays d'accueil des jeux olympiques. Une mise à jour des équipements sportifs du pays a déjà été annoncé par le gouvernement."},
        {id: "73b588a8-c222-402d-8f38-81c6bab406dd", generatedTick: 3, title: "Nouvelles régulations européennes pour les entreprises de technologie !", content: "Avec ces nouvelles directives et critères de qualité sur les produits de technologie, l'Union Européenne prends de court les fabricants et les oblige à revoir leurs méthodes de productions."},
        {id: "596306af-9004-4681-bccc-5e46e137805f", generatedTick: 2, title: "Une Tesla prend feu dans un parking du centre ville de Berlin.", content: "D'après l'entreprise, le conducteur serait en tord."},
      ]
    })
  }

  getNewsForAsset(gameId: string, assetTicker: string): Observable<NewsResponseDto> {
    return of({
      news: [
        {id: "13c84d0d-cd5d-4309-a889-ccc5d92845d5", generatedTick: 1, title: "La France désignée pour accueillir les prochains Jeux Olympiques.", content: "Après de nombreux débats, La France a réussit à faire accepter sa candidature comme pays d'accueil des jeux olympiques. Une mise à jour des équipements sportifs du pays a déjà été annoncé par le gouvernement."},
        {id: "73b588a8-c222-402d-8f38-81c6bab406dd", generatedTick: 3, title: "Nouvelles régulations européennes pour les entreprises de technologie !", content: "Avec ces nouvelles directives et critères de qualité sur les produits de technologie, l'Union Européenne prends de court les fabricants et les oblige à revoir leurs méthodes de productions."},
      ]
    })
  }

  getAssetHealth(gameId: string, assetTicker: string): Observable<AssetHealthDto> {
    return of({
      assetTicker: "APPL",
      assetRating: "A",
      generatedTick: 3
    });
  }
}
