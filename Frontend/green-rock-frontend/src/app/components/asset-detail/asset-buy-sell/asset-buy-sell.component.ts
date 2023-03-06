import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-asset-buy-sell',
  templateUrl: './asset-buy-sell.component.html',
  styleUrls: ['./asset-buy-sell.component.css']
})
export class AssetBuySellComponent implements OnInit {

  @Input() assetTicker !: string;
  @Input() gameId !: string;

  constructor() { }

  ngOnInit(): void {
  }

}
