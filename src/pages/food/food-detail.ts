import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { FoodAddModal } from './food-add';
import { DateService }    from '../../services/utils/date.service';
import { DbService }      from '../../services/firebase/firebase.db.service';

@Component({
  selector: 'page-food-detail',
  templateUrl: 'food-detail.html'
})
export class FoodDetailPage {

  data: any;

  date: any;
  date2: any;

  estmTrueArr = [];
  estimations = [];

  constructor(
    private params: NavParams,
    private db: DbService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private dateService: DateService,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.getData(this.params.get('id'));
  }

  getData(id) {
    this.db.getFood(id, (data) => {
      console.log('FoodDetailPage:: FoodDetailPage: data: ', data);
      this.data = data;
      this.changeFormat(data);
    });
  }

  changeFormat(data) {
    this.date = this.dateService.formatString2Date(data.date, data.time);
    data.time2 = data.time2 || data.time;
    this.date2 = this.dateService.formatString2Date(data.date, data.time2);

    this.estimations = this.data.estimations;
    this.estmTrueArr = this.estimations.filter((item) => {
      return item.answer;
    });

    if (this.data && !this.data.drinking) {
      this.data.drinking = {
        'answer': false,
        'desc': ''
      }
    }
  }

  moreMenu() {
    event.stopPropagation();
    let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: '수정하기',
            handler: () => {
              this.editData();
            }
          },
          {
            text: '삭제하기',
            handler: () => {
              this.deleteData();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      actionSheet.present();
  }

  deleteData() {
    this.db.deleteFood(this.data);
  }

  editData() {
    let foodAddModal = this.modalCtrl.create(FoodAddModal, {params: this.data});
    foodAddModal.onDidDismiss(result => {});
    foodAddModal.present();
  }
}