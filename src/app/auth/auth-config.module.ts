import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';



@NgModule({
    imports:[
        FormsModule,
        AuthModule.forRoot({
        config: {
              authority: 'https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_ukbz1G50a',
              redirectUrl: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: 'please-enter-clientId',
              scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }
      })],
    exports: [AuthModule],
    declarations: [
      LoginComponent
    ],
})
export class AuthConfigModule {}
