import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {QueryService} from "../../../services/query-service/query.service";
import {MarketService} from "../../../services/market-service/market.service";

@Component({
  selector: 'app-game-outlet',
  templateUrl: './game-outlet.component.html',
  styleUrls: ['./game-outlet.component.css']
})
export class GameOutletComponent implements OnInit, OnDestroy {

  gameId: string = "";
  bankAccount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private queryService: QueryService,
    private marketService: MarketService
  ) { }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.params['gameId'];
    this.queryService.getBankAccount(this.gameId).subscribe({
      next: response => this.bankAccount = response.money
    })

    try {
      this.marketService.establishConnection(this.gameId);
    } catch (_){
      this.marketService.closeConnection();
      this.marketService.establishConnection(this.gameId);
    }
  }

  ngOnDestroy(): void {
    this.marketService.closeConnection();
  }

  updateMenu() {
    this.queryService.getBankAccount(this.gameId).subscribe({
      next: response => this.bankAccount = response.money
    })
  }
}
