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

  constructor() {
  }

  ngOnInit() {
    console.log('ngOnInit: ', this.data);
    if (this.data.date) {
      this.dateStr = this.data.date.getDate();
    }
  }

  click(event) {
    this.dayClickEvent.next(event);
  }
}