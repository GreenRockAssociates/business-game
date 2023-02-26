import { Component, OnInit } from '@angular/core';
import {LauncherService} from "../../services/launcherService/launcher.service";
import {GameDto} from "../../interfaces/game.dto";
import {Router} from "@angular/router";
import {faPlusCircle, faPencilAlt, faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import {gameStateToString} from "../../interfaces/game-state.enum";
import {AuthenticationService} from "../../services/authenticationService/authentication.service";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  faPlusCircle = faPlusCircle;
  faPencilAlt = faPencilAlt;
  faDoorOpen = faDoorOpen;
  gameStateToString = gameStateToString;

  errorOccurred = false;
  games: GameDto[] | undefined;
  currentUserId: string | undefined;

  constructor(
    private launcherService: LauncherService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.launcherService.getAllGames().subscribe({
      next: games => this.games = games,
      error: error => {
        if (error.status === 401){
          this.router.navigate(['/login']);
        } else {
          this.errorOccurred = true;
        }
      }
    })

    this.authenticationService.getSessionData().subscribe({
      next: sessionData => this.currentUserId = sessionData.userId,
      error: error => {
        if (error.status === 401){
          this.router.navigate(['/login']);
        } else {
          this.errorOccurred = true;
        }
      }
    })
  }
}
