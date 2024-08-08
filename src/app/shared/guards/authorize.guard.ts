import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/api/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanLoad {

  constructor(private authentication: AuthenticationService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authentication.userLoggedIn) {
      return true;
    } 

    this.router.navigate(
      ['/auth/login']
    );
    return false;
  }
}
