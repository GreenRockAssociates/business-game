import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../../interfaces/login.dto";
import {RegisterDto} from "../../interfaces/register.dto";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {SessionDataDto} from "../../interfaces/session-data.dto";
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
    return new Observable<SessionDataDto>((subscriber) => subscriber.next({userId: "59736a25-26e7-44bf-a55c-0cc775266e0c"}))
  }

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }

  logout() {
    this.httpClient.post(`${environment.baseServerUrl}${environment.authenticationService}/disconnect`,{}, {
      withCredentials: true,
      responseType: "text"
    }).subscribe({
      next: _ => this.router.navigate(['/login'])
    })
  }
}
