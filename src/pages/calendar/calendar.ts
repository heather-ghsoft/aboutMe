import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import { FoodDetailPage } from '../food/food-detail';
// import { ViewService } from '../../services/view/view.service';
// import { CalendarDayPage } from './calendar-day';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})

export class CalendarPage {

  data = [];
  types: any = { 
    'weight': { background: 'rgba(255, 90, 95, 0.27)', tailStr: ' kg', hasDetail: false },  //'#ffc9e6'
    'food': { background: 'rgb(224, 255, 252)', tailStr:'', hasDetail: true, bool1Color: 'green'},  //'#ccfdf9'
    'score': { background: 'rgb(231, 231, 253)', tailStr: ' 점', hasDetail: false }  //'#c8c8fd'
  }

  calData = {};

  constructor(
    private navCtrl: NavController,
    private db: DbService,
    private zone: NgZone
  ) {}

  ngOnInit() {

  }

  getCalendarData(startDate, endDate, callback) {
    console.log('CalendarPage:: getCalendarData');
    this.getWeightData(startDate, endDate, callback);
    this.getFoodData(startDate, endDate, callback);
  }

  getWeightData(startDate, endDate, callback) {
    this.db.getWeights_calendar(startDate, endDate, (resultArr) => {
      
      let _calData = this.calData;

      for ( let dateStr in _calData ) {
        _calData[dateStr] = _calData[dateStr].filter((item) => {
          return item.type !== 'weight';
        });
      }

      resultArr.forEach((d) => {
        _calData[d.date] = _calData[d.date] || [];
        let _d = {
          _id: d._id,
          type: 'weight',
          value: d.value
        };
        _calData[d.date] = [_d].concat(_calData[d.date]);
      });


      
      setTimeout(function() {
        this.zone.run(() => {
          this.calData = _calData;
          callback();
        });
      }.bind(this), 0);  
    });
  }

  // 소식관리 리스트 가지고 오기
  getFoodData(startDate, endDate, callback) {
    this.db.getFoodList_calendar(startDate, endDate, (resultArr) => {
      console.log('CalendarPage:: getFoodData');
      let _calData = this.calData;

      for ( let dateStr in _calData ) {
        _calData[dateStr] = _calData[dateStr].filter((item) => {
          return item.type !== 'food' && item.type !== 'score';
        });
      }

      resultArr.forEach((d) => {

        _calData[d.date] = _calData[d.date] || [];
        _calData[d.date].push({
          _id: d._id,
          type: 'food',
          value: d.food,
          bool1: d.drinking && d.drinking.answer || false,
          image: d.photo && d.photo.url,
          full: d.full,
          estimations: d.estimations
        });
      });
      this.calcFoodsScore(_calData, callback);
    });
  }

  // 소식관리 리스트로 소식 점수 계산 
  calcFoodsScore(_calData, callback) {
    for ( let dateStr in _calData ) {
      // 날짜별 데이터 리스트
      let rows = _calData[dateStr];

      let foodList = [];
      let otherList = [];

      rows.forEach((_row) => {
        const _type = _row['type'];
        if (_type === 'food') {
          foodList.push(_row);
        } else {
          otherList.push(_row);
        }
      });

      if ( !foodList.length ) continue;
      
      let result = {
        type: 'score', 
        value: this.calcFoodScoreOfDay(foodList)
      };

      _calData[dateStr] = otherList.concat([result], foodList);
    }
    setTimeout(function() {
      this.zone.run(() => {
        this.calData = _calData;
        callback();
      });
    }.bind(this), 0);  
  }

  calcFoodScoreOfDay(dayData) {

    // 한 건에 대한 점수 계산
    let totalScore = 0;

    dayData.forEach((row) => {
    
      if ( row['type'] !== 'food' ) return;

      // 소식 점수 (5점 만점)
      let fullScore = ( (10 - row.full.start) + (10 - row.full.end) ) / 2 / 2;
      
      // 마인드이팅 점수 (5점 만점)
      let estiCount = 0;
      // row.estimations.forEach((item) => {
      //   estiCount += item['answer'];
      // });
      
      // let estiScore = estiCount / row.estimations.length * 10 / 2;
      
      // 총 점수
      // totalScore += fullScore + estiScore;
      totalScore += fullScore * 2;

    });
    
    // 하루 평균 점수 (100점 만점)
    let evgScore = Math.ceil( ( totalScore / dayData.length ) * 10 );
    return evgScore;
  }
  
  selectRow(id, type) {
    if (type === 'food') {
      let params = { id: id }
      this.navCtrl.push(FoodDetailPage, params);
    }
  }
}