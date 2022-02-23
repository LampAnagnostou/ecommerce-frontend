export default {

  oidc: {

    //public identifier for clientID
    clientId: '0oa3gm5r6dpywaMsM5d7',

    //issuer of token
    issuer: 'https://dev-36341516.okta.com/oauth2/default',

    //once the user logged in send him there
    redirectUri: 'https://localhost:4200/login/callback',

    scopes: ['openid', 'profile', 'email']
    //openid: required for authentication request
    //profile user first name, last name, phone etc
    //email: user's email address
  }
}
