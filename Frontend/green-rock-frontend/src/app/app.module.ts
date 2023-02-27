import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './pages/authentication/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './pages/authentication/register/register.component';
import { FormValidationErrorMessageComponent } from './components/form-validation-error-message/form-validation-error-message.component';
import {HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import { GameListComponent } from './pages/launcher/game-list/game-list.component';
import { LauncherMenuComponent } from './components/launcher-menu/launcher-menu.component';
import { InvitationsListComponent } from './pages/launcher/invitations-list/invitations-list.component';
import { GenericErrorMessageComponent } from './components/generic-error-message/generic-error-message.component';
import { LauncherOutletComponent } from './pages/launcher/launcher-outlet/launcher-outlet.component';
import { EditGameComponent } from './pages/launcher/edit-game/edit-game.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FormValidationErrorMessageComponent,
    GameListComponent,
    LauncherMenuComponent,
    InvitationsListComponent,
    GenericErrorMessageComponent,
    LauncherOutletComponent,
    EditGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
