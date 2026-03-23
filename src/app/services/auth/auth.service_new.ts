import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private autenticado$ = new BehaviorSubject<boolean>(false);
  email: string | null = null;
 nome: string | null = null;

  constructor() {
    this.checkSession();
  }

  async loginUsuarioSenha(email: string, senha: string): Promise<void> {
    try {
      const result = await signIn({
        username: email,
        password: senha,
      });

      this.autenticado$.next(true);

    } catch (error) {
      console.error('Erro no login', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut();
    this.autenticado$.next(false);
    sessionStorage.clear();
  }

  async checkSession() {
    try {
      await getCurrentUser();
      this.autenticado$.next(true);
    } catch {
      this.autenticado$.next(false);
    }
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

  isAuthenticated() {
    return this.autenticado$.asObservable();
  }
}
