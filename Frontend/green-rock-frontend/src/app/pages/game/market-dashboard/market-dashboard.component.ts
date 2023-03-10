import { Component, OnInit } from '@angular/core';
import {MarketService} from "../../../services/market-service/market.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-market-dashboard',
  templateUrl: './market-dashboard.component.html',
  styleUrls: ['./market-dashboard.component.css']
})
export class MarketDashboardComponent implements OnInit {

  assetList: string[] = [];
  gameId: string = "";

  constructor(
    private marketService: MarketService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.gameId = this.route.parent!.snapshot.params['gameId']; // Never null since we always refer to a game when navigating to this URL
    this.assetList = this.marketService.getAssetList();
  }

}
