import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

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

  /* 
   * string -> date
   * date: 2017-01-21
   * time: 12:24
   * return {year, month, date, date, hour, minute, day, dateObj}
   */
  formatString2Date(date, time) {

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

    let d = new Date(result.year, (result.month - 1), result.date, result.hour, result.minute);
    result.day = this.getDayName(d.getDay());

    result.dateObj = d;

    return result;
  }

  // alert(formatDate('Sun May 11,2014'));
  formatDate2String(date, isDate) {

    let d     = isDate ? date : new Date(date);
    let month = d.getMonth() + 1;
    let day   = d.getDate();
    let year  = d.getFullYear();

    return `${year}-${this.formatTwoString(month)}-${this.formatTwoString(day)}`;
  }
  
  // alert(formatDate('Sun May 11,2014'));
  formatDate2TimeString(date, isDate) {

    let d     = isDate ? date : new Date(date);
    let hour  = d.getHours();
    let min   = d.getMinutes();

    return `${this.formatTwoString(hour)}:${this.formatTwoString(min)}`;
  }

  formatTwoString(num) {
    return ( num < 10 ? '0' : '' ) + num;
  }
}