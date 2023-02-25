import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../../interfaces/login.dto";
import {RegisterDto} from "../../interfaces/register.dto";
import {environment} from "../../../environments/environment";

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

  constructor(
    private httpClient: HttpClient
  ) { }
}
