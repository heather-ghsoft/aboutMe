import { Component, Input, Output, ElementRef, Renderer, EventEmitter } from '@angular/core';

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
  @Input() selectedDate: Date;
  @Output() dayClickEvent: EventEmitter<any> = new EventEmitter();
  @Output() rowClickEvent: EventEmitter<any> = new EventEmitter();

  dateStr;
  isHoliday;
  rows: any[] = [];

  constructor(
    private elem: ElementRef,
    public renderer: Renderer
  ) {
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

  ngOnChanges(changes) {
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
    console.log('ZmCalendarDay:: onClick', this.elem.nativeElement.offsetTop);
    // console.log('this.elem: ', this.elem);
    const calTop = this.elem.nativeElement.parentElement.offsetTop; // 캘린더의 top 위치
    const dayTop = this.elem.nativeElement.offsetTop;               // 해당 날짜 component의 top 위치
    const gap = dayTop - calTop;

    this.changeStyle2DetailList();
    console.log('this.data', this.data);
    console.log('this.date', this.date);

    this.dayClickEvent.next([gap, this.date]);
  }

  changeStyle2DetailList() {
    this.selectedDate = this.date;
  }

  onRowClick() {
    this.rowClickEvent.next();
  }
}