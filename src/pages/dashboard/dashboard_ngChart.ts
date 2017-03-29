import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../services/firebase/firebase.auth.service';
import { DbService } from '../../services/firebase/firebase.db.service';
import { DateService } from '../../services/utils/date.service';
import _ from "lodash";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {

  user: any;
  todayFoodArr: any[] = [];
  currDate: any = new Date();
  tarDate: any = {
    startDate: null,
    endDate: null,
    year: 0,
    month: 0,
    date: 0,
    day: ''
  };


  /*
   * ng-chart setting 
   */
  // lineChart
  lineChartData:Array<any> = [{data:[], label:'food', lineTension: 0.1}];
  lineChartLabels:Array<any> = [];
  lineChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: { 
          beginAtZero: false,
          stepSize: 1,
          min: 0,
          max: 10
        }
      }],
      xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            displayFormats: {
              hour: 'hh a'
            }
          }
      }]
    }
  };
  lineChartColors:Array<any> = [
    { // grey
      backgroundColor: '#ffced0',
      borderWidth: '2',
      borderColor: '#ffa0a3',
      pointRadius: '3',
      pointBorderWidth: '1',
      pointBackgroundColor: '#fff',
      pointBorderColor: '#ffa0a3',
      pointHoverBackgroundColor: '#ff5a5f',
      pointHoverBorderColor: 'ff5a5f'
    }
  ];
  lineChartLegend:boolean = false;
  lineChartType:string = 'line';


  constructor(
    private zone: NgZone,
    public authService: AuthService,
    private db: DbService,
    private dateService: DateService
  ) {

    this.currDate = new Date();
    this.tarDate = this.calcCalendarDate(this.currDate);

    this.getData();
  }

  ngOnInit() {
    let user = this.authService.getCurrentUser();
    console.log('user: ', user);
    this.user = user;
  }

  getData() {

    this.db.getFoodList_calendar(this.tarDate.startDate, this.tarDate.endDate, (dataArr) => {
      this.zone.run(() => {
        this.changeFormatData(dataArr);
      });
      console.log('FoodPage:: getDiaries');
    });
  }

  // 체중 데이터를 데이터 형식에 맞게 가공한다. 
  changeFormatData(weightData) {

    let _xArr: any[] = [];    // x축 데이터
    let _yArr: number[] = [];    // y축 데이터 
    let _ticks: any;

    // data 에서 x, y 축의 데이터에 맞게 변환
    weightData.forEach((item) => {
      // _xArr.push(this.getColXData(item[this.weightColX]));
      _xArr.push(this.getColXData( item['date'], item['time'] ));
      _yArr.push(this.getColYData( item['full']['start'] ));

      _xArr.push(this.getColXData( item['date'], item['time2'] || item['time'] ));
      _yArr.push(this.getColYData( item['full']['end'] ));
    })

    // chart data binding
    this.lineChartLabels = _xArr;
    this.lineChartData.forEach(arr => {
      if (arr.label === 'food') {
        arr.data = _yArr;
      }
    });
    // -
    this.setChartXAxesSize();
  }

  // chart option: x축 min, max 값 계산 후 변경 
  setChartXAxesSize() 
  {
    let _time = this.lineChartOptions.scales.xAxes[0].time;
    _time.min = this.tarDate.startDate;
    _time.max = this.tarDate.endDate;
  }

  getColXData(date, time): any {
    const d = this.dateService.formatString2Date(date, time);
    return d.dateObj;
  }

  getColYData(y) {
    return Number(y);
  }

  // events
  chartClicked(e:any):void {
    console.log(e);
  }
 
  chartHovered(e:any):void {
    console.log(e);
  }

  // changeFormatData(dataArr) {

  //   this.todayFoodArr = [];

  //   if(!dataArr.length) return;

  //   for( let d of dataArr ) {
  //     let time = d.time.split(':');
  //     let time2 = !d.time2 ? time : d.time2.split(':');
  //     let timeNum = Number(time[0]) + (Math.ceil(Number(time[1]) / 6) / 10 || 0);
  //     let timeNum2 = Number(time2[0]) + (Math.ceil(Number(time2[1]) / 6) / 10 || 0);
  //     this.todayFoodArr.push({ time: timeNum, value: d.full.start, label: d.food, _id: d._id, type: d.food });
  //     this.todayFoodArr.push({ time: timeNum2, value: d.full.end, label: d.food, _id: d._id, type: d.food });
  //   }

  //   if ( this.todayFoodArr[0].time > 6 ) {
  //     this.todayFoodArr.splice( 0, 0, { time: 6, value: 0 } );
  //   } else {
  //     for ( let i = 0; i < this.todayFoodArr.length; i++ ) {
  //       let d = this.todayFoodArr[ i ];
  //       let d2 = this.todayFoodArr[ i + 1 ] || { time: 24 };
  //       if ( (d.time2 || d.time) < 6 && 6 <= d2.time ) {
  //         this.todayFoodArr.splice( i + 1, 0, { time: 6, value: 0 });
  //         break;
  //       }
  //     }
  //   }
  //   console.log('DashboardPage:: changeFormatData: this.todayFoodArr: ', this.todayFoodArr);
  // }


  dateDec() {
    this.currDate.setDate(this.currDate.getDate() - 1);
    this.tarDate = this.calcCalendarDate(this.currDate);
    this.getData();
  }

  dateInc() {
    this.currDate.setDate(this.currDate.getDate() + 1);
    this.tarDate = this.calcCalendarDate(this.currDate);
    this.getData();
  }

  calcCalendarDate(_currDate) {

    let _startDate: Date = null;
    let _endDate: Date = null;
    let _firstDate: Date = null;
    let _lastDate: Date = null;

    let _result: any = null;

    // 오늘의 시작 시간
    _startDate = new Date(_currDate.getFullYear(), _currDate.getMonth(), _currDate.getDate());

    console.log('_startDate: ', _startDate);

    // 오늘의 마지막 시간
    _endDate = new Date( _startDate.getTime() );
    _endDate.setDate( _endDate.getDate() + 1 );
    _endDate.setSeconds( _endDate.getSeconds() - 1 );

    console.log('_endDate: ', _endDate);

    _result = {
      startDate: _startDate,
      endDate: _endDate,
      year: _startDate.getFullYear(),
      month: _startDate.getMonth(),
      date: _startDate.getDate(),
      day: this.dateService.getDayName(_startDate.getDay())
    }

    return _result;
  }
}
