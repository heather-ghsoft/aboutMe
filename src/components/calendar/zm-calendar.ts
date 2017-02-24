import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { DateService } from '../../services/utils/date.service';
import _ from "lodash";

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

    // 초기화
    this.year = currDate.getFullYear();
    this.month = currDate.getMonth();
    
    this.startEmptyDay = [];
    this.endEmptyDay = [];
    this.days = [];

    // 변수 선언
    let _startEmptyDay: any[] = [];
    let _endEmptyDay: any[] = [];
    let _days: any[] = [];

    let _cal = this.calcCalendarDate(currDate);

    this.getData.next([_cal.firstDate, _cal.lastDate, (calData) => {

      console.log('ZmCalendar:: calcData: getData: ', calData);

      let allDays = (_cal.lastDate - _cal.firstDate)/1000/60/60/24;

      for(let i = 0; i < allDays + 1; i++) {

        let _date: any;
        let _fullDateStr: string;
        let _day: any;
        
        _date = _.cloneDeep(_cal.firstDate);
        _date.setDate(_date.getDate() + i);

        _fullDateStr = this.dateService.formatDate2String(_date, true);
        _day = {
          date: _date,
          data: calData[_fullDateStr] || {} //this.getDateData()
        }

        if ( _date < _cal.startDate ) {
          _startEmptyDay.push(_day);
        } else if ( _date > _cal.endDate ) {
          _endEmptyDay.push(_day);
        } else {
          _days.push(_day);
        }
      }
        
      this.zone.run(() => {
        this.days = _days;
        this.startEmptyDay = _startEmptyDay;
        this.endEmptyDay = _endEmptyDay;
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

  calcCalendarDate(_currDate) {

    let _startDate: Date = null;
    let _startDay: number = 0;
    let _endDate: Date = null;
    let _endDay: number = 0;
    let _firstDate: Date = null;
    let _lastDate: Date = null;

    let _result: any = null;

    // 이번달의 시작 날짜 
    _startDate = new Date(_currDate.getTime());
    _startDate.setDate(1);

    // 이번달의 시작 요일
    _startDay = _startDate.getDay();

    // 이번달의 마지막 날짜 
    _endDate = new Date( _startDate.getTime() );
    _endDate.setMonth( _endDate.getMonth() + 1 );
    _endDate.setDate( _endDate.getDate() - 1 );
    // 이번달의 마지막 요일
    _endDay = _endDate.getDay();

    // 이번 달의 첫째날 (첫째주 일요일)
    _firstDate = _.cloneDeep(_startDate);
    _firstDate.setDate( _firstDate.getDate() - _firstDate.getDay() );

    // 이번 달의 마지막날 (마지막주 토요일)
    _lastDate = _.cloneDeep(_endDate);
    _lastDate.setDate( _lastDate.getDate() + 6 - _lastDate.getDay() );

    _result = {
      startDate: _startDate,
      startDay: _startDay,
      endDate: _endDate,
      endDay: _endDay,
      firstDate: _firstDate,
      lastDate: _lastDate
    }

    return _result;

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





