import { Component } from '@angular/core';
import {faEnvelope, faGamepad, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-launcher-menu',
  templateUrl: './launcher-menu.component.html',
  styleUrls: ['./launcher-menu.component.css']
})
export class LauncherMenuComponent {
  faGamepad = faGamepad;
  faEnvelope = faEnvelope;
  faUser = faUser;
}
