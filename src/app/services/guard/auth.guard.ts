import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

import { isDevMode } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate() {

      return this.authService.isAuthenticated.pipe(
        map((isAuthenticated) => {
          if (!isAuthenticated) {
            this.authService.login();
            return false;
          }
          return true;
        })
      );
    }
  }
  