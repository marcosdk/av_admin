import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../../auth/cognito.service';

import { fetchAuthSession } from 'aws-amplify/auth';

@Component({
  selector: 'app-top',
  standalone: false,
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent implements OnInit {

  nomeUsuario?: string;
  emailUsuario?: string;

  dropdownVisible = false;

  constructor(private cognitoService: CognitoService) {}

  async ngOnInit() {
    await this.loadUser();
  }

  async loadUser() {

    try {

      const session = await fetchAuthSession();

      const payload = session.tokens?.idToken?.payload;

      this.emailUsuario = payload?.['email'] as string;
      this.nomeUsuario = (payload?.['name'] as string) || this.emailUsuario;


    } catch (error) {

      console.warn('Usuário não autenticado');

    }

  }

  logout() {
    this.cognitoService.logout();
  }

  toggleSidebar() {

    const body = document.querySelector('body');

    if (body) {
      body.classList.toggle('toggle-sidebar');
    }

  }

  async toggleDropdown() {

    this.dropdownVisible = !this.dropdownVisible;

    if (this.dropdownVisible) {
      await this.loadUser();
    }

  }

}
