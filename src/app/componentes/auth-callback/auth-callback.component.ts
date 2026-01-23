import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Authenticating...</p>',
  standalone: false,
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'

})
export class AuthCallbackComponent implements OnInit {

  
  private readonly oidcSecurityService = inject(OidcSecurityService);

  configuration$ = this.oidcSecurityService.getConfiguration();

  userData$ = this.oidcSecurityService.userData$;

  isAuthenticated = false;

  constructor(
    //private oidcSecurityService: OidcSecurityService,
    private router: Router,
    private authService: AuthService
  ) {}

  
  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe((dados) => {

      if (dados.isAuthenticated) {
        this.authService.setEmail(dados.userData.email);
        this.authService.setNome(dados.userData.name);
       
        this.router.navigate(['/']); // Redirecionar para a home após autenticação
      } else {
        console.error('Erro na autenticação');
      }
    });
  }
}
