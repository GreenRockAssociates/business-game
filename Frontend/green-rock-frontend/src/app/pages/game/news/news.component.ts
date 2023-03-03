import { Component, OnInit } from '@angular/core';
import {QueryService} from "../../../services/query-service/query.service";
import {ActivatedRoute} from "@angular/router";
import {NewsReportDto} from "../../../interfaces/dto/news-response.dto";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  gameId: string | undefined;
  news: NewsReportDto[] = [];

  constructor(
    private queryService: QueryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.gameId = this.route.parent!.snapshot.params['gameId']; // Never null since we always refer to a game when navigating to this URL
    if (this.gameId) {
      this.queryService.getAllNews(this.gameId).subscribe({
        next: response => this.news = response.news
      })
    }
  }

}
