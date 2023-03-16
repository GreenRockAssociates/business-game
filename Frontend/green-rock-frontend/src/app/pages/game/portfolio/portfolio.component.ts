import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../services/query-service/query.service";
import {ActivatedRoute} from "@angular/router";
import {AssetDetailDto} from "../../../interfaces/dto/asset-detail.dto";
import {MarketService} from "../../../services/market-service/market.service";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  gameId: string | undefined;
  portfolio: { asset: AssetDetailDto, quantity: number }[] = [];

  constructor(
    private queryService: QueryService,
    private marketService: MarketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.parent!.snapshot.params['gameId']; // Never null since we always refer to a game when navigating to this URL
    if (this.gameId) {
      this.queryService.getPortfolioWithAssetDetail(this.gameId).subscribe({
        next: portfolio => this.portfolio = portfolio
      })
    }
  }

  computePortfolioValue() {
    return this.portfolio.reduce((total, current) => {
      return total + (current.quantity * this.marketService.getAssetCurrentValue(current.asset.assetTicker))
    }, 0);
  }
}
