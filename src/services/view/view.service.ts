import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class ViewService {

  constructor(
    private loadingCtrl: LoadingController
  ) {}

  showLoading() {
    
    console.log('showLoading');

    let loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    loading.present();

    return () => {
      setTimeout(() => {
        loading.dismiss().catch(() => {});
      }, 200);
    };
  }
}