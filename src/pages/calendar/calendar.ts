import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
// import { ViewService } from '../../services/view/view.service';
// import { CalendarDayPage } from './calendar-day';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})

export class CalendarPage {

  data = [];
  types: any = { 
    'weight': { background: 'rgba(255, 90, 95, 0.27)', tailStr: ' kg' },  //'#ffc9e6'
    'food': { background: 'rgb(224, 255, 252)', tailStr:'' },  //'#ccfdf9'
    'score': { background: 'rgb(231, 231, 253)', tailStr: ' 점' }  //'#c8c8fd'
  }

  constructor(
    private navCtrl: NavController,
    private db: DbService
  ) {}

  ngOnInit() {

  }

  getCalendarData(startDate, endDate, callback) {
    
    console.log('CalendarPage:: getCalendarData');

    this.db.getWeights_calendar(startDate, endDate, (dataArr) => {
      let _dataArr = {};
      dataArr.forEach((d) => {
        _dataArr[d.date] = [];
        _dataArr[d.date].push({
          type: 'weight',
          value: d.value
        });
      });
      // console.log('CalendarPage:: getWeight: _dataArr: ', _dataArr);
      callback(_dataArr); 
    });
  }
  
  selectDate(dayDate) {
    // console.log('selectDate: ', dayDate);
    // let index = dayDate.getDate();
    // let params = {
    //   date: dayDate,
    //   data: this.data[index] || {}
    // }
    // this.navCtrl.push(CalendarDayPage, params);
  }
}