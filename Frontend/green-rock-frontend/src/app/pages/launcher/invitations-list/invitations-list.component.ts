import { Component, OnInit } from '@angular/core';
import {LauncherService} from "../../../services/launcher-service/launcher.service";
import {Router} from "@angular/router";
import {GameDto} from "../../../interfaces/game.dto";
import {InvitationDto} from "../../../interfaces/invitation.dto";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-invitations-list',
  templateUrl: './invitations-list.component.html',
  styleUrls: ['./invitations-list.component.css']
})
export class InvitationsListComponent implements OnInit {
  faCheck = faCheck;
  faXmark = faXmark;

  errorOccurred: boolean = false;

  constructor(
    private launcherService: LauncherService,
    private router: Router
  ) { }

  invitationsList: { invitation: InvitationDto, game: GameDto }[] | undefined;

  ngOnInit(): void {
    this.launcherService.getAllInvitationsWithGameDetails()
      .subscribe({
        next: response => this.invitationsList = response,
        error: error => {
          if (error.status === 401){
            this.router.navigate(['/login']);
          } else {
            this.errorOccurred = true;
          }
        }
      })
  }

  answerInvitation(invitation: InvitationDto, answer: boolean) {
    this.launcherService.answerInvitation(invitation, answer).subscribe({
      next: _ => {
        this.invitationsList = this.invitationsList?.filter(item => item.invitation !== invitation);
      },
      error: _ => alert("An error occurred, please try again")
    })
  }
}
