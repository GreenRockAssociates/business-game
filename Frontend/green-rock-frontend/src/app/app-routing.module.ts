import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/authentication/login/login.component";
import {RegisterComponent} from "./pages/authentication/register/register.component";
import {GameListComponent} from "./pages/launcher/game-list/game-list.component";
import {InvitationsListComponent} from "./pages/launcher/invitations-list/invitations-list.component";
import {LauncherOutletComponent} from "./pages/launcher/launcher-outlet/launcher-outlet.component";

const routes: Routes = [
  {path: '', component: LauncherOutletComponent, children: [
      {path: 'games', component: GameListComponent},
      {path: 'invites', component: InvitationsListComponent}
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
