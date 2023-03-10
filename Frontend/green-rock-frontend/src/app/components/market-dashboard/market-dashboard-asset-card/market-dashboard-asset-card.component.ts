import {Component, Input, OnInit} from '@angular/core';
import {QueryService} from "../../../services/query-service/query.service";
import {AssetDetailDto} from "../../../interfaces/dto/asset-detail.dto";
import {MarketService} from "../../../services/market-service/market.service";

@Component({
  selector: 'app-market-dashboard-asset-card',
  templateUrl: './market-dashboard-asset-card.component.html',
  styleUrls: ['./market-dashboard-asset-card.component.css']
})
export class MarketDashboardAssetCardComponent implements OnInit {

  @Input() gameId !: string;
  @Input() assetTicker !: string;

  asset: AssetDetailDto | undefined;
  assetValue: number = 0;

  constructor(
    private queryService: QueryService,
    private marketService: MarketService
  ) { }

  ngOnInit(): void {
    this.queryService.getAssetDetail(this.gameId, this.assetTicker).subscribe({
      next: val => this.asset = val
    })
    this.marketService.getValueObservableForAsset(this.assetTicker)?.subscribe({
      next: val => this.assetValue = val.value
    })
  }

}
