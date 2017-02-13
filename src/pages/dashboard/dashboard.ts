import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { dummyData } from '../../const/dummyData';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {

  currentTabButton: string;
  hospitalHistory: any;
  hospitalCurrent: any;
  user: any;
  timeline: any;
  tabChangingIn: boolean;
  tabChangingOut: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.currentTabButton = '1';
    this.hospitalHistory = [{
        name: 'MLC 치과'
    }];
    this.hospitalCurrent = this.hospitalHistory[0];

    var data = dummyData.data;
    this.user = data.user;
    this.timeline = data.timeline;

    this.tabChangingIn = false;
    this.tabChangingOut = false;
  }

  onClick() {
  }

  manageTabPanelMove() {
    // var tabPanel = $('.main-panel-tab');
  }

  changeTab(tab) {

      if (this.tabChangingIn || this.tabChangingOut) return;

      this.tabChangingIn = true;
      this.tabChangingOut = true;

      var beforeAnimate = '';
      var nextAnimate = '';

      var beforeTab = Object.assign({}, this.currentTabButton);
      this.currentTabButton = tab;

      if (this.currentTabButton === beforeTab) {
          this.tabChangingIn = false;
          this.tabChangingOut = false;
          return;
      }

      if (beforeTab < tab) {
          nextAnimate = 'fadeInRight';
          beforeAnimate = 'fadeOutLeft';
      } else {
          nextAnimate = 'fadeInLeft';
          beforeAnimate = 'fadeOutRight';
      }

      // $("#container").stop().animate({ scrollTop: 0 }, '2000', 'swing', function() {
      //     $('#container .tab-panel[tabIndex=' + tab + ']').eq(0).animateCss(nextAnimate, false, false, function() {
              // if (this.currentTabButton === beforeTab) return;
              // $('#container .tab-panel[tabIndex=' + tab + ']').eq(0).css('opacity', 1);
              this.tabChangingIn = false;
      //     });

      //     $('#container .tab-panel[tabIndex=' + beforeTab + ']').eq(0).animateCss(beforeAnimate, false, false, function() {
              // if (this.currentTabButton === beforeTab) return;
              // $('#container .tab-panel[tabIndex=' + beforeTab + ']').eq(0).css('opacity', 0);
              this.tabChangingOut = false;
      //     });
      // });
  }
}