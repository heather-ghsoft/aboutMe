import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import firebase from 'firebase';

import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { TodoListPage } from '../pages/todo-list/todo-list';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DiaryPage } from '../pages/diary/diary';
import { WeightPage } from '../pages/weight/weight';

import { AuthService } from '../services/firebase/firebase.auth.service';
import { DbService } from '../services/firebase/firebase.db.service';
import { ViewService } from '../services/view/view.service';
import { firebaseConfig } from '../scripts/config';

@Component({
  templateUrl: 'app.html',
  providers: [ AuthService, DbService, ViewService ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  initialized: boolean;
  authInfo: any;
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    private zone: NgZone,
    private db: DbService,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Diary', component: DiaryPage },
      { title: 'Weight', component: WeightPage },
      { title: 'TO DO', component: TodoListPage },
      { title: 'dashboard', component: DashboardPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  ngOnInit() {
    const app = firebase.initializeApp(firebaseConfig);
    // this.initialize();
  }

  // public initialize() {
  //   console.log('MyApp:: initialize');
  //   this.initialized = false;

  //   firebase.auth().onAuthStateChanged((user) => {
  //     console.log('onAuthStateChanged fired');

  //     this.platform.ready().then(() => {
  //       StatusBar.styleDefault();

  //       if (this.initialized) return;

  //       let targetPage;
  //       if (user && !user.isAnonymous) {
  //         console.log('logged in ');
  //         targetPage = DashboardPage;
  //       } else {
  //         console.log('not logged in ');
  //         targetPage = LoginPage;
  //       }

  //       Splashscreen.hide();

  //       this.zone.run(() => {
  //         this.setAuthInfo(user);
  //         this.initialized = true;
  //         this.rootPage = targetPage;
  //         this.nav.setRoot(targetPage, { initialized: true });
  //       });
  //     });
  //   }, err => {
  //       console.error(err);
  //   });
  // }

  // setAuthInfo(authData) {
  //   if (!authData) {
  //     console.log('Info: ', Info);
  //     Info.userId = Info.authId = this.authInfo = null;
  //   } else {
  //     Info.authId = authData.uid;
  //     // this.db.retrieveUserId(Info.authId);
  //     this.authInfo = this.getAuthInfo(authData);
  //   }
  // }

  // getAuthInfo(authData) {
  //   let authInfo;
  //   const provider = authData.providerData[0].providerId;
  //   if (provider === "twitter.com") {
  //     authInfo = authData.providerData[0];
  //   } else if (provider === "facebook.com") {
  //     authInfo = authData.providerData[0];
  //   } else if (authData.github) {
  //     authInfo = authData.github;
  //   } else {
  //     authInfo = authData || {};
  //   }
  //   return authInfo;
  // }

}



