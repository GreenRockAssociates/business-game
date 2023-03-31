import {Component, Input} from '@angular/core';
import {NewsReportDto} from "../../../interfaces/dto/news-response.dto";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('200ms ease-out',
              style({ height: 100, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 100, opacity: 1 }),
            animate('200ms ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class NewsCardComponent {
  faChevronRight = faChevronRight;

  @Input() newsReport !: NewsReportDto;
  newsOpened: boolean = false;

  toggleNews() {
    this.newsOpened = !this.newsOpened;
  }
}
