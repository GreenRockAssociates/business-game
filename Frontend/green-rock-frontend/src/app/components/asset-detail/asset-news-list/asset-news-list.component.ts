import {Component, Input, OnInit} from '@angular/core';
import {QueryService} from "../../../services/query-service/query.service";
import {NewsReportDto} from "../../../interfaces/dto/news-response.dto";

@Component({
  selector: 'app-asset-news-list',
  templateUrl: './asset-news-list.component.html',
  styleUrls: ['./asset-news-list.component.css']
})
export class AssetNewsListComponent implements OnInit {

  @Input() assetTicker !: string;
  @Input() gameId !: string;

  news: NewsReportDto[] = [];

  constructor(
    private queryService: QueryService
  ) { }

  ngOnInit(): void {
    this.queryService.getNewsForAsset(this.gameId, this.assetTicker).subscribe({
      next: response => this.news = response.news
    })
  }

}
