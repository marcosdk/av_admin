import { enableProdMode } from '@angular/core';
import { cognitoConfig } from './app/auth/cognito.config';
import { Amplify } from 'aws-amplify';

Amplify.configure(cognitoConfig);

import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
