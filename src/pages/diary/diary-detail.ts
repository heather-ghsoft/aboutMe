import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DateService }    from '../../services/utils/date.service';
import { DbService }      from '../../services/firebase/firebase.db.service';

@Component({
  selector: 'page-diary-detail',
  templateUrl: 'diary-detail.html'
})
export class DiaryDetailPage {

  data = {};

  constructor(
    private params: NavParams,
    private db: DbService,
    private navCtrl: NavController,
    private dateService: DateService
  ) {
    this.getData(this.params.get('id'));
  }

  getData(id) {
    this.db.getDiary(id, (data) => {
      this.data = data;
      console.log('DiaryPage:: getDiary: data: ', data);
    });
  }
}