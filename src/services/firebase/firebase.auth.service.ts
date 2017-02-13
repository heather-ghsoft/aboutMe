import { Injectable } from '@angular/core';
import { Facebook, GooglePlus } from 'ionic-native';

import firebase from 'firebase';

@Injectable()
export class AuthService {

  constructor() { }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  registerUserWithEmail(inputData) {
    const { email, password } = inputData;
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  loginWithEmail(inputData) {
    const auth = firebase.auth();
    const { email, password } = inputData;
    return auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * login facebook with cordova plugin
   * @return Promise<any>
   */
  loginWithFacebookPlugin() {
    const auth = firebase.auth();
    let user, profile;
    // check if app has permission already
    return Facebook.getLoginStatus().then(res => {
      if (res.status === 'connected') {
        return res;
      } else {
        // try to get access permission
        return Facebook.login(['email']);
      }
    })
      .then(res => {
        console.log('loginWithFacebookPlugin success: ', res);

        // get creds with accessToken
        const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        // sign in with credential
        return auth.signInWithCredential(credential);
      }).then(_user => {
        user = _user;
        // get facebook profile info
        return this.getFaceBookUserProfile();
      }).then(_profile => {
        profile = _profile || {};
        console.log('facebook profile:', profile);
      //   return this.db.getUser(user.uid).toPromise();
      // }).then((_user: any) => {
      //   const userFound = !!_user;
        // update user data with authState and facebook profile data
        // this.db.addOrUpdateUser(user, profile);
      });
  }

  loginWithFacebookPopup() {
    const auth = firebase.auth();
    let user;
    // Creates the provider object.
    var provider = new firebase.auth.FacebookAuthProvider();
    // You can add additional scopes to the provider:
    provider.addScope('public_profile');
    // provider.addScope('email');
    // provider.addScope('user_friends');

    // Sign in with popup:
    return auth.signInWithPopup(provider).then(result => {
      // The Facebook firebase.auth.AuthCredential containing the Facebook
      // access token:
      // var credential = result.credential;
      user = result.user;
      //   return this.getFaceBookUserProfile();
      // }).then(profile => {
      //   console.log('facebook profile:', profile);
      // update user data with authState and facebook profile data
      // this.setUser(user, profile);
      // this.db.addOrUpdateUser(user, { phoneNumber });
    });
  }

  getFaceBookUserProfile() {
    return Facebook.api('me?fields=id,name,email,firstName,lastName,picture.width(720).height(720).as(avatarLarge)', []).then((profileData) => {
      console.log(JSON.stringify(profileData));
      return profileData;
    }).catch(err => {
      console.error('getFaceBookUserProfile', err);
      return null;
    });
  }

  loginWithGoogleUsingPopupFirebase() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider);
    return firebase.auth().getRedirectResult().then(result => {
      console.log('Google Sign in success', result);
    });
  }

  loginWithGoogleUsingPlugin() {
    // note for iOS the googleplus plugin requires ENABLE_BITCODE to be turned off in the Xcode

    return GooglePlus.login({
      'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '_google_client_app_id_.apps.googleusercontent.com',
      'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    }).then(authData => {
      console.log('got google auth data:', JSON.stringify(authData, null, 2));
      const credential = firebase.auth.GoogleAuthProvider.credential(authData.idToken, authData.accessToken);

      firebase.auth().signInWithCredential(credential).then((success) => {
        console.log('loginWithGoogleUsingPlugin success!', JSON.stringify(success, null, 2));
      });
    });
  }

  loginWithGoogleUsingWeb() {
    return new Promise((resolve, reject) => {
      this.googleWebLogin(tokenData => {
        console.log('got google auth data:', JSON.stringify(tokenData, null, 2));
        // note the underscore_here vs camelCase for google plus oauth plugin
        const credential = firebase.auth.GoogleAuthProvider.credential(tokenData.id_token, tokenData.access_toekn);

        firebase.auth().signInWithCredential(credential)
          .then((success) => {
            console.log('success!', JSON.stringify(success, null, 2));
            resolve(success);
          }, err => reject(err));
      });
    });
  }

  // based on https://forum.ionicframework.com/t/how-to-implement-google-oauth-in-an-ionic-2-app/47038/6
  googleWebLogin(onSuccess: Function) {
    console.log('trying google pure web login...');
    // build authUrl:

    let nonce = (Math.random().toString(36) + '00000').slice(-5);
    let authBase = 'https://accounts.google.com/o/oauth2/v2/auth';

    let redirect_uri = window.location.origin;
    let appFromFile = false;
    if (redirect_uri.indexOf('file://') == 0) {
      appFromFile = true;
      redirect_uri = 'http://localhost/callback';
    }

    let authParams = {
      response_type: 'id_token token', // Firebase require both - id_token token
      nonce: nonce, // required for id_token - then should be verifued
      client_id: '_google_client_app_id_.apps.googleusercontent.com',

      redirect_uri: redirect_uri,
      remember: 'none',
      scope: ['email', 'openid', 'profile'].join(' ')
    };
    let params = [];
    for (let k in authParams) {
      params.push(k + '=' + authParams[k]);
    }
    let authUrl = authBase + '?' + params.join('&');

    console.log('authUrl', authUrl);
    let ref = window.open(authUrl, '_blank');

    // NOTE for '_self' to work with i.e. ionic serve - dedicatated handler is required as there app will be fully reloaded
    // let ref = window.open(authUrl, appFromFile?'_blank':'_self'); // _blank is required for the redired_uri to work

    ref.addEventListener('loadstart', (event: any) => {
      console.log('loadstart for', event.url);
      if ((event.url).startsWith(redirect_uri)) {
        ref.close();
        let response = (event.url).split('#')[1];
        console.debug('oauth response: ' + response)
        onSuccess(this.parseGoogleToken(response));
      }
    });
  }

  parseGoogleToken(hash: string) {
    let token = {
      created: new Date().getTime()
    };
    let parms = hash.split('&');
    for (let i in parms) {
      let kv = parms[i].split('=');
      token[kv[0]] = kv[1];
    }
    return token;
  }

  logout() {
    firebase.auth().signOut();
  }

}
