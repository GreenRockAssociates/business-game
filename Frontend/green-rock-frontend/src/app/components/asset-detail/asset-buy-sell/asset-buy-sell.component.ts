import {Component, Input, OnInit} from '@angular/core';
import {QueryService} from "../../../services/query-service/query.service";
import {MarketService} from "../../../services/market-service/market.service";
import {AssetStatisticalAnalysisDto} from "../../../interfaces/dto/asset-statistical-analysis.dto";
import {PortfolioEntryDto} from "../../../interfaces/dto/portfolio.dto";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {CommandService} from "../../../services/command-service/command.service";
import {AssetHealthDto} from "../../../interfaces/dto/asset-health.dto";

@Component({
  selector: 'app-asset-buy-sell',
  templateUrl: './asset-buy-sell.component.html',
  styleUrls: ['./asset-buy-sell.component.css']
})
export class AssetBuySellComponent implements OnInit {
  faMinus = faMinus;
  faPlus = faPlus;

  @Input() assetTicker !: string;
  @Input() gameId !: string;
  currentAssetValue: number = 0;
  assetHealth: AssetHealthDto | undefined;
  assetAnalysis: AssetStatisticalAnalysisDto | undefined;
  assetPortfolioEntry: PortfolioEntryDto | undefined;
  bankAccount: number = 0;

  sharesTransactionAmount: number = 0;
  notEnoughSharesError: boolean = false;
  notEnoughFundsError: boolean = false;

  constructor(
    private queryService: QueryService,
    private commandService: CommandService,
    private marketService: MarketService,
  ) { }

  ngOnInit(): void {
    this.marketService.getValueObservableForAsset(this.assetTicker)?.subscribe({
      next: marketEntry => this.currentAssetValue = marketEntry.value
    });
    this.queryService.getAssetHealth(this.gameId, this.assetTicker).subscribe({
      next: value => this.assetHealth = value
    })
    this.queryService.getAssetAnalysis(this.gameId, this.assetTicker).subscribe({
      next: value => this.assetAnalysis = value,
      error: err => {
        if (err.status !== 412){
          throw err // Do nothing in case of error 412 as it means that not enough time has passed
        }
      }
    })
    this.queryService.getPortfolio(this.gameId).subscribe({
      next: value => {
        this.assetPortfolioEntry = value.portfolio.find(entry => entry.assetId === this.assetTicker) ?? {
          assetId: this.assetTicker,
          quantity: 0
        }
      }
    })
    this.queryService.getBankAccount(this.gameId).subscribe({
      next: response => this.bankAccount = response.money
    })
  }

  decrementTransaction() {
    this.sharesTransactionAmount = Math.max(this.sharesTransactionAmount - 1, 0);
  }

  incrementTransaction() {
    this.sharesTransactionAmount++;
  }

  sell() {
    this.commandService.sellAsset(this.gameId, this.assetTicker, this.sharesTransactionAmount).subscribe({
      error: err => {
        if (err.status === 412) this.showNotEnoughSharesError()
      }
    })
  }

  buy() {
    this.commandService.buyAsset(this.gameId, this.assetTicker, this.sharesTransactionAmount).subscribe({
      error: err => {
        if (err.status === 412) this.showNotEnoughFundsError()
      }
    })
  }

  private notEnoughSharesErrorTimeout: NodeJS.Timeout | undefined;
  private notEnoughFundsErrorTimeout: NodeJS.Timeout | undefined;
  private clearTimeouts(){
    clearTimeout(this.notEnoughSharesErrorTimeout);
    clearTimeout(this.notEnoughFundsErrorTimeout);
  }

  private showNotEnoughSharesError() {
    this.notEnoughSharesError = true;
    this.notEnoughFundsError = false;
    this.clearTimeouts();
    this.notEnoughSharesErrorTimeout = setTimeout(() => this.notEnoughSharesError = false, 2000);
  }

  private showNotEnoughFundsError() {
    this.notEnoughSharesError = false;
    this.notEnoughFundsError = true;
    this.clearTimeouts();
    this.notEnoughFundsErrorTimeout = setTimeout(() => this.notEnoughFundsError = false, 2000);
  }
}
