import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {GameListComponent} from "./pages/game-list/game-list.component";
import {InvitationsListComponent} from "./pages/invitations-list/invitations-list.component";
import {LauncherOutletComponent} from "./pages/launcher-outlet/launcher-outlet.component";

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
