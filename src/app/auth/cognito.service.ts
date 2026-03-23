import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  signIn,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  getCurrentUser,
  signOut
} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})


export class CognitoService {

  constructor(private router: Router) {}

  async signIn(email: string, password: string) {

    try {

        const currentUser = await getCurrentUser();

        // se já existe sessão
        if (currentUser) {

            const currentEmail = currentUser.signInDetails?.loginId;

            // se for outro usuário
            if (currentEmail !== email) {

                await signOut();

            } else {

                return {
                status: 'authenticated'
                };

            }

        }

    } catch {}

    try {

        const result = await signIn({
        username: email,
        password
        });

        if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {

        return {
            status: 'new_password_required'
        };

        }

        return {
        status: 'authenticated'
        };

    }

    catch (error: any) {
        console.error('Erro no login', error);
        return {    
            status: 'error',
            message: this.traduzErro(error)
        };

    }

}



async forgotPassword(email: string) {

    try {

      await resetPassword({
        username: email
      });

      return { success: true };

    }

    catch (error: any) {

        return {
            success: false,
            message: this.traduzErro(error)
        };

    }

  }


  async confirmForgotPassword(email: string, code: string, password: string) {

    try {

        await confirmResetPassword({
            username: email,
            confirmationCode: code,
            newPassword: password
        });

        return { success: true };

    }

    catch (error: any) {

        return {
            success: false,
            message: this.traduzErro(error)
        };

    }

  }


  async completeNewPassword(password: string) {

    try {

      await confirmSignIn({
        challengeResponse: password
      });

      return {
        status: 'authenticated'
      };

    }

    catch (error: any) {

        return {
            status: 'error',
            message: this.traduzErro(error)
        };

    }

  }

  async logout() {

    try {

      await signOut();

    } catch (error) {

      console.warn('Erro ao fazer logout', error);

    }

    this.router.navigate(['/login']);

  }


    private traduzErro(error: any): string {

        const msg = error?.message ?? '';
        
        if (msg.includes('User does not exist'))
            return 'Usuário não encontrado.';

        if (msg.includes('User is disabled'))
            return 'Usuário desativado. Procure um administrador.';

        if (msg.includes('Incorrect username or password'))
            return 'Email ou senha inválidos.';

        if (msg.includes('NotAuthorizedException'))
            return 'Email ou senha inválidos.';

        if (msg.includes('UserNotConfirmedException'))
            return 'Usuário ainda não confirmou o cadastro.';

        if (msg.includes('PasswordResetRequiredException'))
            return 'É necessário redefinir a senha.';

        if (msg.includes('CodeMismatchException'))
            return 'Código inválido.';

        if (msg.includes('ExpiredCodeException'))
            return 'O código expirou. Solicite um novo.';

        if (msg.includes('LimitExceededException'))
            return 'Muitas tentativas. Aguarde alguns minutos.';

        if (msg.includes('Network'))
            return 'Erro de conexão com o servidor.';

        if (msg.includes('Network'))
            return 'Erro de conexão com o servidor.';

        if (msg.includes('confirmationCode is required'))
            return 'Código de confirmação é obrigatório.';

        if (msg.includes('Invalid verification code provided'))
            return 'Código de verificação inválido. Tente novamente.';

        if (msg.includes('username is required to signIn'))
            return 'Email é obrigatório.';

        if (msg.includes('password is required to signIn'))
            return 'Senha é obrigatória.';

        if (msg.includes('username is required to resetPassword'))
            return 'Email é obrigatório.';

        return msg || 'Erro inesperado ao autenticar.';
    }


}
