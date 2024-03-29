import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './pages/authentication/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './pages/authentication/register/register.component';
import { FormValidationErrorMessageComponent } from './components/form-validation-error-message/form-validation-error-message.component';
import {HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import { GameListComponent } from './pages/launcher/game-list/game-list.component';
import { LauncherMenuComponent } from './components/launcher-menu/launcher-menu.component';
import { InvitationsListComponent } from './pages/launcher/invitations-list/invitations-list.component';
import { GenericErrorMessageComponent } from './components/generic-error-message/generic-error-message.component';
import { LauncherOutletComponent } from './pages/launcher/launcher-outlet/launcher-outlet.component';
import { EditGameComponent } from './pages/launcher/edit-game/edit-game.component';
import { CreateGameComponent } from './pages/launcher/create-game/create-game.component';
import { GameOutletComponent } from './pages/game/game-outlet/game-outlet.component';
import { MarketDashboardComponent } from './pages/game/market-dashboard/market-dashboard.component';
import { AssetDetailComponent } from './pages/game/asset-detail/asset-detail.component';
import { NewsComponent } from './pages/game/news/news.component';
import { PortfolioComponent } from './pages/game/portfolio/portfolio.component';
import { AssetCardComponent } from './components/portfolio/asset-card/asset-card.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { GameDateComponent } from './components/game-date/game-date.component';
import { NewsCardComponent } from './components/news/news-card/news-card.component';
import {TickToGameDatePipe} from "./pipes/tick-to-game-date.pipe";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetBuySellComponent } from './components/asset-detail/asset-buy-sell/asset-buy-sell.component';
import { MarketGraphComponent } from './components/asset-detail/market-graph/market-graph.component';
import { AssetNewsListComponent } from './components/asset-detail/asset-news-list/asset-news-list.component';
import { MarketDashboardAssetCardComponent } from './components/market-dashboard/market-dashboard-asset-card/market-dashboard-asset-card.component';
import { ProfileComponent } from './pages/launcher/profile/profile.component';

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
    EditGameComponent,
    CreateGameComponent,
    GameOutletComponent,
    MarketDashboardComponent,
    AssetDetailComponent,
    NewsComponent,
    PortfolioComponent,
    AssetCardComponent,
    GameMenuComponent,
    GameDateComponent,
    NewsCardComponent,
    TickToGameDatePipe,
    AssetBuySellComponent,
    MarketGraphComponent,
    AssetNewsListComponent,
    MarketDashboardAssetCardComponent,
    ProfileComponent
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
    }),
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
