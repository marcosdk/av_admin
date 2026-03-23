import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../auth/cognito.service';



enum AuthStep {
  LOGIN = 'login',
  FORGOT = 'forgot',
  RESET = 'reset',
  CHANGE_PASSWORD = 'change_password'
}

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {


  AuthStep = AuthStep;
  step: AuthStep = AuthStep.LOGIN;

  email = '';
  password = '';

  code = '';
  newPassword = '';
  confirmPassword = '';

  loading = false;
  error = '';

  constructor(private router: Router, private cognito: CognitoService) {}


  async login() {

    this.error = '';
    this.loading = true;

    const result = await this.cognito.signIn(this.email, this.password);

    this.loading = false;

    if (result.status === 'authenticated') {
      this.router.navigate(['/']);
    }

    else if (result.status === 'new_password_required') {
      this.step = AuthStep.CHANGE_PASSWORD;
    }

    else {
      this.error = result.message?? 'Erro ao fazer login.';
    }
  }

  async forgotPassword() {

    this.error = '';
    this.loading = true;

    const result = await this.cognito.forgotPassword(this.email);

    this.loading = false;

    if (result.success) {
      this.step = AuthStep.RESET;
    } else {
      this.error = result.message ?? 'Erro ao fazer login.';
    }

  }

  async resetPassword() {

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'As senhas não coincidem';
      return;
    }

    this.loading = true;

    const result = await this.cognito.confirmForgotPassword(
      this.email,
      this.code,
      this.newPassword
    );

    this.loading = false;

    if (result.success) {
      this.step = AuthStep.LOGIN;
    } else {
      this.error = result.message ?? 'Erro ao fazer login.';
    }

  }

  async changePassword() {

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'As senhas não coincidem';
      return;
    }

    this.loading = true;

    const result = await this.cognito.completeNewPassword(
      this.newPassword
    );

    this.loading = false;

    if (result.status === 'authenticated') {
      this.router.navigate(['/']);
    } else {
      this.error = result.message ?? 'Erro ao fazer login.';
    }

  }

  passwordRules = [
    {
      label: 'Mínimo 8 caracteres',
      test: (p: string) => p.length >= 8
    },
    {
      label: '1 letra maiúscula',
      test: (p: string) => /[A-Z]/.test(p)
    },
    {
      label: '1 letra minúscula',
      test: (p: string) => /[a-z]/.test(p)
    },
    {
      label: '1 número',
      test: (p: string) => /\d/.test(p)
    },
    {
      label: '1 caractere especial',
      test: (p: string) => /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]/.test(p)
    }
  ];

  passwordValida(): boolean {
    return this.passwordRules.every(rule => rule.test(this.newPassword));
  }





}
