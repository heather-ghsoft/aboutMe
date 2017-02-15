import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'zm-calendar-day',
  templateUrl: 'zm-calendar-day.html',
  // inputs: ['targetDate'],
  // outputs: ['dayClickEvent']
})

export class ZmCalendarDay {

  @Input() data: any;
  @Input() date: Date;
  @Input() types: any;
  @Output() dayClickEvent: EventEmitter<any> = new EventEmitter();

  dateStr;
  isHoliday;
  rows: any[] = [];

  constructor() {
  }

  ngOnInit() {
    if (this.date) {
      this.dateStr = this.date.getDate();
      let day = this.date.getDay();
      this.isHoliday = ([0, 6].indexOf(day) >= 0);
    }

    if (this.data) {
      this.setData();
    }
  }

  setData() {
    for(let _data of this.data) {
      let row = {
        'background': this.types[_data.type].background,
        value: _data.value + this.types[_data.type].tailStr
      };
      this.rows.push(row);
    }
  }

  onClick() {
    this.dayClickEvent.next(this.dateStr);
  }
}