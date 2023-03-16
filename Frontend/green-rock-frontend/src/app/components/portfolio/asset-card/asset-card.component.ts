import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
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
      this.marketService.getValueObservableForAsset(this.asset.assetTicker)?.subscribe({
        next: val => this.assetValue = val.value
      });
    }
  }
}
