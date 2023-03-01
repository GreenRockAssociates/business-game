import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameDto} from "../../../interfaces/game.dto";
import {LauncherService} from "../../../services/launcher-service/launcher.service";
import {faArrowLeft, faCircleCheck, faPlusCircle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {GameStateEnum} from "../../../interfaces/game-state.enum";
import {InvitationDto} from "../../../interfaces/invitation.dto";

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.css']
})
export class EditGameComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  faCircleCheck = faCircleCheck;
  faXmark = faXmark;
  faPlusCircle = faPlusCircle;

  errorOccurred: boolean = false;
  game: GameDto | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private launcherService: LauncherService
  ) { }

  ngOnInit(): void {
    this.fetchGame();
  }

  fetchGame(){
    this.launcherService.getGameById(this.route.snapshot.params['gameId']).subscribe({
      next: game => {
        if (game.gameState === GameStateEnum.CREATED){ // Ensure the game is editable
          this.game = game
        } else {
          this.router.navigate(['/games'])
        }
      },
      error: error => {
        if (error.status === 401){
          this.router.navigate(['/login']);
        } else {
          this.errorOccurred = true;
        }
      }
    })
  }

  rescindInvitation(invitation: InvitationDto) {
    this.launcherService.deleteInvitation(invitation).subscribe({
      next: _ => this.game!.invitations = this.game!.invitations!.filter(item => item !== invitation),
      error: _ => alert("An error occurred, please try again.")
    })
  }

  sendInvitation(){
    if (!this.game){
      return;
    }

    const email = window.prompt("User's email address");
    if (!email) {
      return
    }

    this.launcherService.addInvitation(this.game.id, email).subscribe({
      next: _ => this.fetchGame(),
      error: error => {
        switch (error.status){
          case 401:
            this.router.navigate(['/login']);
            break;
          case 400:
            alert("Please enter a valid email address");
            break;
          case 404:
            alert("This player doesn't exist");
            break;
          default:
            this.errorOccurred = true;
            break;
        }
      }
    })
  }

  startGame() {
    if (this.game) {
      this.launcherService.startGame(this.game.id).subscribe({
        next: _ => this.router.navigate(['/games']),
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
}
