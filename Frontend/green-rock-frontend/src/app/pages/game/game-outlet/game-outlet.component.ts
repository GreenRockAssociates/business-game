import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {QueryService} from "../../../services/query-service/query.service";

@Component({
  selector: 'app-game-outlet',
  templateUrl: './game-outlet.component.html',
  styleUrls: ['./game-outlet.component.css']
})
export class GameOutletComponent implements OnInit {

  gameId: string = "";
  bankAccount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private queryService: QueryService
  ) { }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.params['gameId'];
    this.queryService.getBankAccount(this.gameId).subscribe({
      next: response => this.bankAccount = response.money
    })
  }

  updateMenu() {
    this.queryService.getBankAccount(this.gameId).subscribe({
      next: response => this.bankAccount = response.money
    })
  }
}
