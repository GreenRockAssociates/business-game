import {Component, Input} from '@angular/core';

const YEAR_DURATION_IN_TICKS = 43200;
const MONTH_DURATION_IN_TICKS = 3600;

@Component({
  selector: 'app-game-date',
  templateUrl: './game-date.component.html',
  styleUrls: ['./game-date.component.css']
})
export class GameDateComponent {
  @Input() currentTick!: number;

  currentTickToDateString(): string {
    return `Year ${Math.floor(this.currentTick / YEAR_DURATION_IN_TICKS) + 1} - Month ${(Math.floor(this.currentTick / MONTH_DURATION_IN_TICKS) % 12) + 1}`;
  }
}
