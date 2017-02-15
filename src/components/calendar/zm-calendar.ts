import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'zm-calendar',
  templateUrl: 'zm-calendar.html'
})

export class ZmCalendar {

  todayDate;
  currDate;
  day;
  date;
  year;
  month;
  pickerDate;

  startDay;
  endDay;

  startEmptyDay: any[] = [];
  endEmptyDay: any[] = [];
  days: any[] = [];

  dayLabels: string[] = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];

  constructor(
  ) {
    this.todayDate = new Date();
    this.currDate = new Date();
    this.currDate.setDate(1);

    // this.day = this.todayDate.getDay();  // 0 ~ 6
    // this.date = this.todayDate.getDate();

    
    this.calcData(this.currDate);
  }

  ngOnInit() {

  }

  calcData(currDate) {

    this.year = currDate.getFullYear();
    this.month = currDate.getMonth();
    this.startEmptyDay = [];
    this.endEmptyDay = [];
    this.days = [];

    let startDate = new Date(currDate.getTime());
    startDate.setDate(1);
    let startDay = startDate.getDay();

    let endDate = new Date(startDate.getTime());
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(endDate.getDate() - 1);
    let endDay = endDate.getDay();

    for(let i = 0; i < startDay; i++) {
      this.startEmptyDay.push({});
    }
    for(let i = 6; i > endDay; i--) {
      this.endEmptyDay.push({});
    }

    let lastDay = endDate.getDate();
    for(let i = 1; i < lastDay + 1; i++) {
      
      let _date = new Date(currDate.getTime());
      _date.setDate(i);

      let _day = {
        date: _date,
        weight: 0,
        foods: [],
        score: 0
      }
      this.days.push(_day);
    }
  }

  monthDec() {
    this.currDate.setMonth(this.currDate.getMonth() - 1);
    this.calcData(this.currDate);
  }

  monthInc() {
    this.currDate.setMonth(this.currDate.getMonth() + 1);
    this.calcData(this.currDate);
  }
}




