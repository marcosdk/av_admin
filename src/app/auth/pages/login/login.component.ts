import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
  //  private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.email || !this.password) {
      return;
    }

    this.loading = true;
    this.error = null;

  /*  this.authService.loginUsuarioSenha(this.email, this.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(err => {
        console.error(err);
        this.error = err?.message || 'Erro ao autenticar';
      })
      .finally(() => {
        this.loading = false;
      });*/
  }
}




