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
  @Input() calData: any;
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() rowClickEvent: EventEmitter<any> = new EventEmitter();

  todayDate;
  currDate;
  day;
  date;
  year;
  month;
  cal: any = null;
  pickerDate;

  startDay;
  endDay;

  days: any[] = [];

  dayLabels: string[] = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];

  selectedDate = null;
  rowNum = 5;
  calendarTop = '0px';

  constructor(
    private dateService: DateService,
    private zone: NgZone
  ) {
    console.log('ZmCalendar:: constructor');
    this.todayDate = new Date();
    this.currDate = new Date();
    this.currDate.setDate(1);

    this.calcData(this.currDate);
  }

  ngOnInit() {
    this.getData.next([this.cal.firstDate, this.cal.lastDate, this.bindData.bind(this)]);
  }

  ngOnChanges(changes){
    this.bindData();
  }

  calcData(currDate) {
    console.log('ZmCalendar:: calcData');
    // 초기화
    this.year = currDate.getFullYear();
    this.month = currDate.getMonth();
    
    this.days = [];
    this.cal = this.calcCalendarDate(currDate);
  }

  // 해당 날짜 데이터 전체 리스트 보기
  selectDate(top, date) {
    this.calendarTop = '-' + top + 'px';
    this.selectedDate = date;
  }

  // 해당 데이터 상세보기
  selectRow(data) {
    console.log('ZmCalendar:: selectRow: data: ', data);
    this.rowClickEvent.next(data);
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

    this.rowNum = 1 + Math.floor((_lastDate.getTime() - _firstDate.getTime()) / 60 / 60 / 24 / 1000 / 7);

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

    if (this.selectedDate !== null) {
      this.selectedDate = null; 
      this.calendarTop = '0px';
      return;
    } 
    this.currDate.setMonth(this.currDate.getMonth() - 1);
    this.calcData(this.currDate);
    this.getData.next([this.cal.firstDate, this.cal.lastDate, this.bindData.bind(this)]);
  }

  monthInc() {

    if (this.selectedDate !== null) {
      this.selectedDate = null; 
      this.calendarTop = '0px';
      return;
    } 
    this.currDate.setMonth(this.currDate.getMonth() + 1);
    this.calcData(this.currDate);
    this.getData.next([this.cal.firstDate, this.cal.lastDate, this.bindData.bind(this)]);
  }

  bindData() {
    // 변수 선언
    let _days: any[] = [];
    let allDays = (this.cal.lastDate - this.cal.firstDate)/1000/60/60/24;

    for(let i = 0; i < allDays + 1; i++) {

      let _date: any;
      let _fullDateStr: string;
      let _day: any;
      
      _date = _.cloneDeep(this.cal.firstDate);
      _date.setDate(_date.getDate() + i);

      _fullDateStr = this.dateService.formatDate2String(_date, true);
      _day = {
        date: _date,
        data: this.calData[_fullDateStr] || {} 
      }

      if (_date.getDay() === 0) {
        _days.push([]);
      }

      if ( _date < this.cal.startDate || _date > this.cal.endDate ) {
        _day['type'] = "otherMonth";
      } else {
        _day['type'] = "currMonth";
      }
      // _days.push(_day);
      _days[_days.length - 1].push(_day);
    }
    this.zone.run(() => {
      this.days = _days;
    });
  }

  swipeEvent(event) {
    if (event.direction === 2) {
      this.monthInc();
    } else if (event.direction === 4){
      this.monthDec();
    }
  }
}





