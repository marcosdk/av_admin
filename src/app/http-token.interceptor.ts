

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { fetchAuthSession } from 'aws-amplify/auth';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // só adiciona token para API
    if (!req.url.includes('/api')) {
      return next.handle(req);
    }

    return from(fetchAuthSession()).pipe(

      switchMap((session) => {

        const token = session.tokens?.accessToken?.toString();

        if (token) {

          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });

          return next.handle(authReq);
        }

        return next.handle(req);

      })

    );

  }

}

