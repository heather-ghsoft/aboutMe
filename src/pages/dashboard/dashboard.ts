import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../services/firebase/firebase.auth.service';
import { DbService } from '../../services/firebase/firebase.db.service';
import { DateService } from '../../services/utils/date.service';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {

  user: any;
  todayFoodArr: any[] = [];
  currDate: any = new Date();
  tarDate: any = {
    startDate: null,
    endDate: null,
    year: 0,
    month: 0,
    date: 0,
    day: ''
  };

  colXDomain: any[] = [];
  colYDomain: any[] = [];

  constructor(
    private zone: NgZone,
    public authService: AuthService,
    private db: DbService,
    private dateService: DateService
  ) {

    this.currDate = new Date();
    this.tarDate = this.calcCalendarDate(this.currDate);

    this.getData();
    this.makeChartData();
  }

  ngOnInit() {
    let user = this.authService.getCurrentUser();
    console.log('user: ', user);
    this.user = user;
  }

  getData() {

    this.db.getFoodList_calendar(this.tarDate.startDate, this.tarDate.endDate, (dataArr) => {
      this.zone.run(() => {
        this.changeFormatData(dataArr);
      });
      console.log('FoodPage:: getDiaries');
    });
  }

  changeFormatData(dataArr) {

    this.todayFoodArr = [];

    if(!dataArr.length) return;

    for( let d of dataArr ) {
      let time = d.time.split(':');
      let time2 = !d.time2 ? time : d.time2.split(':');
      let timeNum = Number(time[0]) + (Math.ceil(Number(time[1]) / 6) / 10 || 0);
      let timeNum2 = Number(time2[0]) + (Math.ceil(Number(time2[1]) / 6) / 10 || 0);
      this.todayFoodArr.push({ time: timeNum, value: d.full.start, label: d.food, _id: d._id, type: d.food });
      this.todayFoodArr.push({ time: timeNum2, value: d.full.end, label: d.food, _id: d._id, type: d.food });
    }

    if ( this.todayFoodArr[0].time > 6 ) {
      this.todayFoodArr.splice( 0, 0, { time: 6, value: 0 } );
    } else {
      for ( let i = 0; i < this.todayFoodArr.length; i++ ) {
        let d = this.todayFoodArr[ i ];
        let d2 = this.todayFoodArr[ i + 1 ] || { time: 24 };
        if ( (d.time2 || d.time) < 6 && 6 <= d2.time ) {
          this.todayFoodArr.splice( i + 1, 0, { time: 6, value: 0 });
          break;
        }
      }
    }
    console.log('DashboardPage:: changeFormatData: this.todayFoodArr: ', this.todayFoodArr);
  }

  makeChartData() {
    this.colXDomain = [0, 24];
    this.colYDomain = [0, 10];
  }

  dateDec() {
    this.currDate.setDate(this.currDate.getDate() - 1);
    this.tarDate = this.calcCalendarDate(this.currDate);
    this.getData();
  }

  dateInc() {
    this.currDate.setDate(this.currDate.getDate() + 1);
    this.tarDate = this.calcCalendarDate(this.currDate);
    this.getData();
  }

  calcCalendarDate(_currDate) {

    let _startDate: Date = null;
    let _endDate: Date = null;
    let _firstDate: Date = null;
    let _lastDate: Date = null;

    let _result: any = null;

    // 오늘의 시작 시간
    _startDate = new Date(_currDate.getFullYear(), _currDate.getMonth(), _currDate.getDate());

    console.log('_startDate: ', _startDate);

    // 오늘의 마지막 시간
    _endDate = new Date( _startDate.getTime() );
    _endDate.setDate( _endDate.getDate() + 1 );
    _endDate.setSeconds( _endDate.getSeconds() - 1 );

    console.log('_endDate: ', _endDate);

    _result = {
      startDate: _startDate,
      endDate: _endDate,
      year: _startDate.getFullYear(),
      month: _startDate.getMonth(),
      date: _startDate.getDate(),
      day: this.dateService.getDayName(_startDate.getDay())
    }

    return _result;
  }
}
