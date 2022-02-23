import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import * as OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(private oktaAuthStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features: {
        registration: true
      },
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0], // give me everything in the URL BEFORE oauth 2
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true, //Proof Key for Code Exchange
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
    this.oktaSignIn.remove();

    this.oktaSignIn.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
      (response: any) => {
      if (response.status === 'SUCCESS'){
        this.oktaAuth.signInWithRedirect();
      }
    },
      (error: any) => {
      throw error;
      }
    );
  }

}
