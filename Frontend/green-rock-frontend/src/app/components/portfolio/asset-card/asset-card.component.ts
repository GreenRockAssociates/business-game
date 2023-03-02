import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AssetDetailDto} from "../../../interfaces/dto/asset-detail.dto";
import {MarketService} from "../../../services/market-service/market.service";

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.css']
})
export class AssetCardComponent implements OnChanges{
  @Input() asset!: AssetDetailDto;
  @Input() quantity!: number;

  assetValue: number = 0;

  constructor(
    private marketService: MarketService
  ) {}

  ngOnChanges(changes: SimpleChanges){
    if (changes['asset']){
      this.assetValue = this.marketService.getAssetCurrentValue(this.asset.assetTicker);
    }
  }
}
