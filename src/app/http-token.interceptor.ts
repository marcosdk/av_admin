import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private oidcSecurityService: OidcSecurityService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    //console.log(this.oidcSecurityService.getIdToken());
    // Adiciona o token apenas para requisições à API
    if (request.url.includes('/api')) {


      this.oidcSecurityService.checkAuth().subscribe((dados) => {
      
        if (dados.isAuthenticated) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${dados.idToken}`
            }
          });
         
       
        }
      });
     
    }
    return next.handle(request);
  }
}
