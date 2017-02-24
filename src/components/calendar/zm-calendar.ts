import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { DateService } from '../../services/utils/date.service';

@Component({
  selector: 'zm-calendar',
  templateUrl: 'zm-calendar.html'
})

export class ZmCalendar {

  // @Input() data: any;
  @Input() types: any;
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() dayClickEvent: EventEmitter<any> = new EventEmitter();

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
    private dateService: DateService,
    private zone: NgZone
  ) {
    this.todayDate = new Date();
    this.currDate = new Date();
    this.currDate.setDate(1);
  }

  ngOnInit() {
    this.calcData(this.currDate);
  }

  calcData(currDate) {

    console.log('ZmCalendar: calcData');

    this.year = currDate.getFullYear();
    this.month = currDate.getMonth();
    this.startEmptyDay = [];
    this.endEmptyDay = [];
    this.days = [];
    let _days = [];

    let startDate = new Date(currDate.getTime());
    startDate.setDate(1);
    let startDay = startDate.getDay();

    let endDate = new Date(startDate.getTime());
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(endDate.getDate() - 1);
    let endDay = endDate.getDay();

    this.getData.next([startDate, endDate, (data) => {

      console.log('ZmCalendar:: calcData: getData: ', data);

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

        let _monthStr = this.dateService.formatTwoString(this.month + 1);
        let _dateStr = this.dateService.formatTwoString(i);
        let _fullDateStr = `${this.year}-${_monthStr}-${_dateStr}`;

        let _day = {
          date: _date,
          data: data[_fullDateStr] || {} //this.getDateData()
        }
        _days.push(_day);
      }
        
      this.zone.run(() => {
        this.days = _days;
      });
    }]);
  }

  getDateData() {
    // console.log(this.data);
    return [
      // {type: 'weight', value: 45},
      // {type: 'food', value: '안녕하세요안녕하세요'},
      // {type: 'food', value: '카레'},
      // {type: 'score', value: 8}
    ];
  }

  selectDate(data) {
    this.dayClickEvent.next(data);
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





