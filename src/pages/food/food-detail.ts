import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DateService }    from '../../services/utils/date.service';
import { DbService }      from '../../services/firebase/firebase.db.service';

@Component({
  selector: 'page-food-detail',
  templateUrl: 'food-detail.html'
})
export class FoodDetailPage {

  data = {};

  date:any;

  constructor(
    private params: NavParams,
    private db: DbService,
    private navCtrl: NavController,
    private dateService: DateService
  ) {
    this.getData(this.params.get('id'));
  }

  getData(id) {
    this.db.getFood(id, (data) => {
      this.data = data;
      this.changeFormat(data);
      console.log('FoodDetailPage:: getDiary: data: ', data);
    });
  }

  changeFormat(data) {
    this.date = this.dateService.formatString2Date(data.date, data.time);
  }
}