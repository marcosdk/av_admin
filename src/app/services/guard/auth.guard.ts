

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { fetchAuthSession } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {

    try {

      const session = await fetchAuthSession();

      if (session.tokens?.accessToken) {

        return true;

      }

      this.router.navigate(['/login']);
      return false;

    }

    catch {

      this.router.navigate(['/login']);
      return false;

    }

  }

}

  