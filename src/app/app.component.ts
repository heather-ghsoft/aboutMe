import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import firebase from 'firebase';

// import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { TodoListPage } from '../pages/todo-list/todo-list';
// import { DashboardPage } from '../pages/dashboard/dashboard';
// import { DiaryPage } from '../pages/diary/diary';
import { CalendarPage } from '../pages/calendar/calendar';
import { WeightPage } from '../pages/weight/weight';
import { WeightChartPage } from '../pages/weight-chart/weight-chart';
import { WeightChartD3Page } from '../pages/weight-chart/weight-chart-d3';

import { AuthService } from '../services/firebase/firebase.auth.service';
import { DbService } from '../services/firebase/firebase.db.service';
import { ViewService } from '../services/view/view.service';
import { UtilService } from '../services/utils/util.service';
import { DateService } from '../services/utils/date.service';
import { firebaseConfig } from '../scripts/config';

@Component({
  templateUrl: 'app.html',
  providers: [ AuthService, DbService, ViewService, UtilService, DateService ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  initialized: boolean;
  // authInfo: any;
  // rootPage: any = LoginPage;
  rootPage: any;
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
      { title: 'Calendar', component: CalendarPage },
      { title: 'Weight', component: WeightPage },
      { title: 'Trend', component: WeightChartPage },
      { title: 'Trend D3', component: WeightChartD3Page },
      { title: 'TO DO', component: TodoListPage }
    ];
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Okay, so the platform is ready and our plugins are available.
  //     // Here you can do any higher level native things you might need.
  //     StatusBar.styleDefault();
  //     Splashscreen.hide();
  //   });
  // }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  ngOnInit() {
    // const app = firebase.initializeApp(firebaseConfig);
    // this.initialize();
  }

  initializeApp() {
    console.log('MyApp:: initialize');
    this.initialized = false;

    firebase.initializeApp(firebaseConfig)
    firebase.auth().onAuthStateChanged((user) => {
      console.log('onAuthStateChanged fired');

      this.platform.ready().then(() => {
        StatusBar.styleDefault();

        if (this.initialized) return;

        let targetPage;
        if (user && !user.isAnonymous) {
          console.log('logged in ');
          targetPage = WeightChartD3Page;
        } else {
          console.log('not logged in ');
          targetPage = LoginPage;
        }

        Splashscreen.hide();

        this.zone.run(() => {
          // this.setAuthInfo(user);
          this.initialized = true;
          this.rootPage = targetPage;
          this.nav.setRoot(targetPage, { initialized: true });
        });
      });
    }, err => {
        console.error(err);
    });
  }

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



