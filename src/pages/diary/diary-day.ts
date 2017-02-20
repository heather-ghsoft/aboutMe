import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';

@Component({
  selector: 'page-diary-day',
  templateUrl: 'diary-day.html'
})

export class DiaryDayPage {

  date;
  data;
  weight;
  desc;

  constructor(
    private db: DbService,
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    this.date = this.navParams.get('date');
    this.data = this.navParams.get('data');
    console.log('this.date: ', this.date);
  }

}