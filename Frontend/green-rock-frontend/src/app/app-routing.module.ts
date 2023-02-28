import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/authentication/login/login.component";
import {RegisterComponent} from "./pages/authentication/register/register.component";
import {GameListComponent} from "./pages/launcher/game-list/game-list.component";
import {InvitationsListComponent} from "./pages/launcher/invitations-list/invitations-list.component";
import {LauncherOutletComponent} from "./pages/launcher/launcher-outlet/launcher-outlet.component";
import {EditGameComponent} from "./pages/launcher/edit-game/edit-game.component";
import {CreateGameComponent} from "./pages/launcher/create-game/create-game.component";

const routes: Routes = [
  {path: 'launcher', component: LauncherOutletComponent, children: [
      {path: '', component: GameListComponent},
      {path: 'games', component: GameListComponent},
      {path: 'invites', component: InvitationsListComponent},
      {path: 'edit/:gameId', component: EditGameComponent},
      {path: 'new-game', component: CreateGameComponent}
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
