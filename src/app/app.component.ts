import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { environment } from '../environments/environment';
import { CognitoService } from './auth/cognito.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'pc_admin';
 
  
  isLoginPage = false;
  isAuthenticated = false;

  constructor( private cognitoService: CognitoService,  private router: Router ) {
    
  }
  

  ngOnInit(): void {
      // Detecta mudança de rota
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        this.isLoginPage = event.urlAfterRedirects.startsWith('/login');

      }

    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {

    this.cognitoService.logout();

    console.warn('Acionou o logout ');

    
    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
                            
    
  }

}
