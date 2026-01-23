import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';




@Injectable({
  providedIn: 'root',
})
export class AuthService {

    email: string | null = null;
    nome: string | null = null;

    public isAuthenticated: Observable<boolean>;

    constructor(private oidcSecurityService: OidcSecurityService) {
        // Atualizar estado de autenticação baseado no fluxo do OIDC
        this.isAuthenticated = this.oidcSecurityService.isAuthenticated$.pipe(
            map((auth) => auth.isAuthenticated) // Extraindo o valor booleano

    );

    }
    
    setEmail(email: string): void {
        this.email = email;
    }
    
    getEmail(): string | null {
        return this.email;
    }


    setNome(nome: string): void {
        this.nome = nome;
    }
    
    getNome(): string | null {
        return this.nome;
    }
    login() {
        console.log("logando");
        this.oidcSecurityService.authorize();
    }

    public logout() {
        
        this.oidcSecurityService.logoff();

        // Clear session storage
        if (window.sessionStorage) {
            window.sessionStorage.clear();
        }

        window.location.href = environment.urlLogOut; 
        
        
    }

    get estaAutenticado() {
        return this.oidcSecurityService.isAuthenticated$;
    }

    get userData() {
        return this.oidcSecurityService.userData$;
    }

    

}
