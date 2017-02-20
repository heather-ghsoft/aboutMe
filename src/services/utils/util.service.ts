import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor(
  ) {}

  getDayName(dayNum) {
    switch(dayNum) {
      case 0: return '일';
      case 1: return '월';
      case 2: return '화';
      case 3: return '수';
      case 4: return '목';
      case 5: return '금';
      case 6: return '토';
    }
  }

  changeDataFormat(date, time) {

    if (!date || !time) return;

    let tempDate = date.split('-');
    let tempTime = time.split(':');
    let result = {
      year: tempDate[0],
      month: tempDate[1],
      date: tempDate[2],
      hour: tempTime[0],
      minute: tempTime[1],
      day: '',
      dateObj: null
    };

    let d = new Date(result.year, (result.month - 1), result.date);
    result.day = this.getDayName(d.getDay());

    result.dateObj = d;

    return result;
  }

  getOrderTimeDesc(date) {
    console.log(date.getMonth(), '-', date.getDate());
    return 9999999999999 - date.getTime();
  }
}