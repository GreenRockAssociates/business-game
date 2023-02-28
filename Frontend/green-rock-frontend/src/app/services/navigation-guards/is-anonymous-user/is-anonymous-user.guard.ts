import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthenticationService} from "../../authentication-service/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class IsAnonymousUserGuard implements CanActivate {
  constructor(
    public authenticationService: AuthenticationService,
    public router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticationService.getSessionData().pipe(
      map((_) => {
        this.router.navigateByUrl('/launcher/games');
        return false;
      }),
      catchError(() => {
        return of(true);
      })
    );
  }

}
