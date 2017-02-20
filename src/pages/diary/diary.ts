import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { DbService } from '../../services/firebase/firebase.db.service';
// import { ViewService } from '../../services/view/view.service';
import { DiaryDayPage } from './diary-day';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})

export class DiaryPage {

  data = [];
  types: any = { 
    'weight': { background: 'rgb(255, 232, 245)', tailStr: ' kg' },  //'#ffc9e6'
    'food': { background: 'rgb(224, 255, 252)', tailStr:'' },  //'#ccfdf9'
    'score': { background: 'rgb(231, 231, 253)', tailStr: ' 점' }  //'#c8c8fd'
  }

  constructor(
    private navCtrl: NavController
    // private db: DbService
  ) {}

  ngOnInit() {

  }
  
  selectDate(dayDate) {
    console.log('selectDate: ', dayDate);
    let index = dayDate.getDate();
    let params = {
      date: dayDate,
      data: this.data[index] || {}
    }
    this.navCtrl.push(DiaryDayPage, params);
  }
}