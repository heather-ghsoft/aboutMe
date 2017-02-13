import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NavController, NavParams } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';


import { ViewService } from '../../services/view/view.service';
import { AuthService } from '../../services/firebase/firebase.auth.service';

import { CustomValidators } from '../../custom-validators/custom-validators';

@Component ({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {

  error: any;
  submitted: boolean;
  myForm: FormGroup;

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams, 
    private _fb: FormBuilder,
    private auth: AuthService,
    private viewService: ViewService
    ) {
  }

  ngOnInit() {
    this.submitted = false;
    // the short way
    this.myForm = this._fb.group({
      email: ['zuhern@naver.com', [Validators.required, CustomValidators.email]],
      password: ['gwgd8d', [Validators.required, Validators.minLength(4)]],
      password2: ['gwgd8d', [Validators.required, Validators.minLength(4)]]
    });
  }

  goToMain() {
    this.navCtrl.setRoot(DashboardPage);
  }

  register(credentials, isValid) {

    const completeLoading = this.viewService.showLoading();
    this.auth.registerUserWithEmail(credentials)
      .then((user) => {
        return this.auth.loginWithEmail(credentials);
      })
      .then((user) => {
        completeLoading();
        this.goToMain();
      })
      .catch((error) => {
        completeLoading();
        console.log('RegisterPage: register: error: ', error);
      });
    // 메인화면으로 이동 
  }
}