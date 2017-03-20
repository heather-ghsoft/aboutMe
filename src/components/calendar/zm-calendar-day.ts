import { Component, Input, Output, ElementRef, Renderer, EventEmitter } from '@angular/core';

@Component({
  selector: 'zm-calendar-day',
  templateUrl: 'zm-calendar-day.html',
  // inputs: ['targetDate'],
  // outputs: ['dayClickEvent']
})

export class ZmCalendarDay {

  @Input() date: Date;
  @Input() dayData: any;
  @Input() types: any;
  @Input() selectedDate: Date;
  @Output() dayClickEvent: EventEmitter<any> = new EventEmitter();
  @Output() rowClickEvent: EventEmitter<any> = new EventEmitter();

  data: any;
  dateStr;
  isHoliday;
  rows: any[] = [];

  constructor(
    private elem: ElementRef,
    public renderer: Renderer
  ) {
  }

  ngOnInit() {

    this.data = this.dayData['data'];

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
    // 데이터를 캘린더에 필요한 것만 선택
    for(let _data of this.data) {
      let row = {
        _id: _data._id,
        type: _data.type,
        image: _data.image,
        bool1: _data.bool1,
        background: this.types[_data.type].background,
        value: _data.value + this.types[_data.type].tailStr
      };
      this.rows.push(row);
    }
  }

  onClick() {
    const calTop = this.elem.nativeElement.parentElement.parentElement.offsetTop; // 캘린더의 top 위치
    const dayTop = this.elem.nativeElement.offsetTop;               // 해당 날짜 component의 top 위치
    const gap = dayTop - calTop;

    this.changeStyle2DetailList();
    this.dayClickEvent.next([gap, this.date]);
  }

  changeStyle2DetailList() {
    this.selectedDate = this.date;
  }

  onRowClick(id, type) {
    if (this.selectedDate !== null) {
      this.rowClickEvent.next([id, type]);
    }
  }
}