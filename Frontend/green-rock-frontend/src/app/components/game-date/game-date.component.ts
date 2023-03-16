import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-game-date',
  templateUrl: './game-date.component.html',
  styleUrls: ['./game-date.component.css']
})
export class GameDateComponent {
  @Input() currentTick!: number;
}
