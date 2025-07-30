import { Injectable } from '@angular/core';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private loginService: LoginService, private router: Router) { }

  private checkLogin(): boolean {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  canActivate(): boolean {
    return this.checkLogin();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.checkLogin();
  }
}
