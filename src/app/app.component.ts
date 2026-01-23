import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'pc_admin';
 
  
  isAuthenticated = false;

  constructor(private oidcSecurityService: OidcSecurityService) {
    
  }
  

  ngOnInit(): void {
      
  }

  login(): void {
    this.oidcSecurityService.authorize(); // Inicia o fluxo de login
  }

  logout(): void {
    console.warn('Acionou o logout ');

    this.oidcSecurityService.logoff(); // Faz logout

    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
                            
    window.location.href = "https://sa-east-1ukbz1g50a.auth.sa-east-1.amazoncognito.com/login?client_id=7mti6kj1asbe4acqufmt84hnp1&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fd2xifqim8uhfbn.cloudfront.net"; 

  }

}
