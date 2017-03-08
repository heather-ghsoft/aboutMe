import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalController, NavController, Content } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import { FoodAddModal } from './food-add';
import { FoodDetailPage } from './food-detail';

@Component({
  selector: 'page-food',
  templateUrl: 'food.html',
})

export class FoodPage {

  @ViewChild(Content) content: Content;
  
  dataArr: Array<any> = [];
  editMode: boolean;
  newValue: string = "";
  newDate: Date = new Date();
  scrollTop: number;
  dividers: any[] = [];

  constructor(
    private zone: NgZone,
    private db: DbService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    
    console.log('FoodPage: constructor');

    this.getData();
  };

  ngOnInit() {
    console.log('FoodPage: ngOnInit');
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) =>  {
      this.zone.run(() => this.scrollTop = event.scrollTop);
    });  
    this.content.ionScrollEnd.subscribe((event) =>  {
      this.zone.run(() => this.scrollTop = event.scrollTop);
    });  
  }

  getData() {
    this.db.getFoods(true, (dataArr) => {
      this.zone.run(() => this.dataArr = dataArr);
      console.log('FoodPage:: getDiaries');
    });
  }

  openAddData() {
    let foodAddModal = this.modalCtrl.create(FoodAddModal);
    foodAddModal.onDidDismiss(data => {
      // firebase save
      if (data === null) return;
      // this.addData(data);
    });
    foodAddModal.present();
  }

  deleteData(id) {
    this.db.deleteFood(id);
  }

  editData(data) {
    let foodAddModal = this.modalCtrl.create(FoodAddModal, {params: data});
    foodAddModal.onDidDismiss(result => {});
    foodAddModal.present();
  }

  go2Detail(id) {
    console.log('id:: ', id);
    let params = {
      id: id
    }
    this.navCtrl.push(FoodDetailPage, params);
  }

}
