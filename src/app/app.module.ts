import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {environment} from "../environments/environment";

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';


@NgModule({
    declarations: [
        AppComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'clientId'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }


// providers: [
//   {
//     provide: 'SocialAuthServiceConfig',
//     useValue: {
//       autoLogin: false,
//       providers: [
//         {
//           id: GoogleLoginProvider.PROVIDER_ID,
//           provider: new GoogleLoginProvider('google_client_id')
//         }
//       ]
//     } as SocialAuthServiceConfig,
//   }
// ],
