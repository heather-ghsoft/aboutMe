import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'zm-calendar-day',
  templateUrl: 'zm-calendar-day.html',
  // inputs: ['targetDate'],
  // outputs: ['dayClickEvent']
})

export class ZmCalendarDay {

  @Input() data: any;
  @Output() dayClickEvent: EventEmitter<any> = new EventEmitter();

  dateStr;
  date;
  isHoliday;

  constructor() {
  }

  ngOnInit() {
    console.log('ngOnInit: ', this.data);
    if (this.data.date) {
      this.date = this.data.date;
      this.dateStr = this.date.getDate();
      let day = this.date.getDay();
      this.isHoliday = ([0, 6].indexOf(day) >= 0);
    }
  }

  // getDayColor() {
  //   if (!this.date) return;

  //   let day = this.date.getDay();
  //   switch(day) {
  //     case 6 : 
  //     case 0 : return '#bbb';
  //     default: return '#444';
  //   }
  // }

  click(event) {
    this.dayClickEvent.next(event);
  }
}