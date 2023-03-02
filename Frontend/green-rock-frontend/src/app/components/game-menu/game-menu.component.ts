import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {faCoins, faWallet, faNewspaper, faPowerOff} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent {

  faCoins = faCoins;
  faWallet = faWallet;
  faNewspaper = faNewspaper;
  faPowerOff = faPowerOff;

  @Input() gameId!: string;
  @Input() bankAccount!: number;

  constructor(
    private router: Router
  ) { }

  exitGame() {
    this.router.navigate(['/launcher'])
  }
}
