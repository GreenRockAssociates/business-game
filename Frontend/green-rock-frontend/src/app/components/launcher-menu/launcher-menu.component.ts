import { Component } from '@angular/core';
import {faEnvelope, faGamepad, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "../../services/authentication-service/authentication.service";

@Component({
  selector: 'app-launcher-menu',
  templateUrl: './launcher-menu.component.html',
  styleUrls: ['./launcher-menu.component.css']
})
export class LauncherMenuComponent {
  faGamepad = faGamepad;
  faEnvelope = faEnvelope;
  faUser = faUser;
  faPowerOff = faPowerOff

  constructor(
    private authenticationService: AuthenticationService
  ) {
  }

  logout() {
    this.authenticationService.logout();
  }
}
