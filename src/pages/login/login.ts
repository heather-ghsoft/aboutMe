import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WeightPage } from '../weight/weight';
import { RegisterPage } from '../register/register';
import { ViewService } from '../../services/view/view.service';
import { AuthService } from '../../services/firebase/firebase.auth.service';

import { CustomValidators } from '../../custom-validators/custom-validators';

@Component ({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  error: any;
  isMobilePlatform: boolean;
  submitted: boolean;
  myForm: FormGroup;

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams, 

    private _fb: FormBuilder,
    private platform: Platform,
    private auth: AuthService,
    private viewService: ViewService
    ) {
  }

  ngOnInit() {
    this.isMobilePlatform = !this.platform.is('core');
    this.submitted = false;
    // the short way
    this.myForm = this._fb.group({
      email: ['zuhern@naver.com', [Validators.required, CustomValidators.email]],
      password: ['gwgd8d', [Validators.required, Validators.minLength(4)]]
    });
  }

  goToMain() {
    this.navCtrl.setRoot(WeightPage);
  }

  goToRegister() {
    this.navCtrl.setRoot(RegisterPage);
  }

  login(credentials, isValid) {
    console.log('credentials: ', credentials);
    console.log('isValid: ', isValid);

    if (!isValid) {
      return;
    }

    const completeLoading = this.viewService.showLoading();
    this.auth.loginWithEmail(credentials)
      .then(user => {
        let currentUser = this.auth.getCurrentUser();
        console.log('loginView: user: ', currentUser);
        completeLoading();
        this.goToMain();
      })
      .catch(error => {
        completeLoading();
        console.log('loginView: error: ', error);
      });
    // this.login();
    // 메인화면으로 이동 
  }

  getNavParamsToPass() {
    const phoneNumber = ''; //this.navParams.get('phoneNumber');
    const recommender = ''; //this.navParams.get('recommender');
    return { phoneNumber, recommender };
  }

  registerUserWithFacebook() {
    const completeLoading = this.viewService.showLoading();
    let promise;
    if (this.isMobilePlatform){
      promise = this.auth.loginWithFacebookPlugin();
    } else {
      promise = this.auth.loginWithFacebookPopup();
    }
    return promise.then(data => {
      completeLoading();
      console.log('login success! data: ', data);
      this.goToMain();
    }).catch(err => {
      completeLoading();
      this.error = err;
      if (err.errorMessage) {
        this.error = err.errorMessage;
      }
      console.log('facebook auth error', err);
    });
  }

  registerUserWithGoogleUsingPopupFirebase() {
    this.auth.loginWithGoogleUsingPopupFirebase().then(data => {
      this.goToMain();
    }).catch(err => {
      this.error = err;
    });
  }

  registerUserWithGoogleUsingPlugin() {
    this.auth.loginWithGoogleUsingPlugin().then(data => {
      this.goToMain();
    }).catch(err => {
      this.error = err;
    });
  }

  registerUserWithGoogleUsingWeb() {
    this.auth.loginWithGoogleUsingWeb().then(data => {
      this.goToMain();
    }).catch(err => {
      this.error = err;
    });
  }
}