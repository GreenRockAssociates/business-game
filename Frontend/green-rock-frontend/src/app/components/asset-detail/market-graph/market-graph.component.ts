import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-market-graph',
  templateUrl: './market-graph.component.html',
  styleUrls: ['./market-graph.component.css']
})
export class MarketGraphComponent implements OnInit {

  @Input() assetTicker !: string;
  @Input() gameId !: string;

  constructor() { }

  ngOnInit(): void {
  }

}
