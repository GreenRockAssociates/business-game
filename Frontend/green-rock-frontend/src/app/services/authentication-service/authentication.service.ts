import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../../interfaces/dto/login.dto";
import {RegisterDto} from "../../interfaces/dto/register.dto";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {SessionDataDto} from "../../interfaces/dto/session-data.dto";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  login(credentials: LoginDto){
    return this.httpClient.post(`${environment.baseServerUrl}${environment.authenticationService}/login`, credentials, {
      withCredentials: true,
      responseType: "text"
    })
  }

  register(credentials: RegisterDto){
    return this.httpClient.post(`${environment.baseServerUrl}${environment.authenticationService}/register`, credentials, {
      withCredentials: true,
      responseType: "text"
    })
  }

  getSessionData(): Observable<SessionDataDto>{
    return this.httpClient.get<SessionDataDto>(`${environment.baseServerUrl}${environment.authenticationService}/session-data`, {
      withCredentials: true
    })
  }

  logout() {
    this.httpClient.post(`${environment.baseServerUrl}${environment.authenticationService}/disconnect`,{}, {
      withCredentials: true,
      responseType: "text"
    }).subscribe({
      next: _ => this.router.navigate(['/login'])
    })
  }

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }
}
