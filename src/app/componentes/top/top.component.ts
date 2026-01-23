import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { inject } from '@angular/core';


@Component({
  selector: 'app-top',
  standalone: false,
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent implements OnInit {


  private readonly oidcSecurityService = inject(OidcSecurityService);

  nomeUsuario?: string;
  emailUsuario?: string;
  dropdownVisible = false; // Controle do estado do dropdown
  
  isAuthenticated = false;

  constructor(private authService: AuthService) {}


  ngOnInit() {

    this.oidcSecurityService.checkAuth().subscribe((dados) => {
      
      if (dados.isAuthenticated) {
        this.emailUsuario = dados.userData.email;
        this.nomeUsuario = dados.userData.name;
      }
    });

  }

  logout(){
    this.authService.logout();
  }

  toggleSidebar() {
    const body = document.querySelector('body');
    if (body) {
      body.classList.toggle('toggle-sidebar');
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;

    this.oidcSecurityService.checkAuth().subscribe((dados) => {
      
      if (dados.isAuthenticated) {
        this.emailUsuario = dados.userData.email;
        this.nomeUsuario = dados.userData.name;
      }
    });
  }
}

