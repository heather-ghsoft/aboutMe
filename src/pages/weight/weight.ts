import { Component, NgZone } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import { WeightAddModal } from './weight-add';

@Component({
  selector: 'page-weight',
  templateUrl: 'weight.html',
})

export class WeightPage {
  
  dataArr: Array<any> = [];
  editMode: boolean;
  newValue: string = "";
  newDate: Date = new Date();

  constructor(
    private zone: NgZone,
    private db: DbService,
    private modalCtrl: ModalController
  ) {
    
    console.log('WeightListPage: constructor');

    this.getData();
  };

  ngOnInit() {
    console.log('WeightListPage: ngOnInit');
  }

  // keypressNewData (event) {
  //   var code = event.keyCode || event.which;
  //   if( code === 13 )
  //   {
  //     if( event.srcElement.tagName === "INPUT" )
  //     {
  //       event.preventDefault();
  //       this.addData();
  //     }
  //   }
  // }

  getData() {
    this.db.getWeights((dataArr) => {
      this.zone.run(() => this.dataArr = dataArr);
      console.log('WeightListPage:: getWeight: ', this.dataArr);
    });
  }

  // getWeight() {
  //   this.db.getWeight().then((weights) => {
      
  //     console.log(weights);
  //     this.weights = weights;
  //     console.log('WeightListPage:: getWeight: ', this.weights);
  //   });
  // }
  openAddData() {
    let weightAddModal = this.modalCtrl.create(WeightAddModal);
    weightAddModal.onDidDismiss(data => {
      // firebase save
      if (data === null) return;
      this.addData(data);
    });
    weightAddModal.present();
  }

  addData(data) {
    console.log('addData: data', data);
    if(data.value === '') return;
    this.db.addWeight(data, () => {});
  }  

  deleteData(key) {
    this.db.deleteWeight(key);
  }

  editData(data) {
    let weightAddModal = this.modalCtrl.create(WeightAddModal, data);
    weightAddModal.onDidDismiss(data => {
      // firebase save
      if (data === null) return;
      this.updateData(data);
    });
    weightAddModal.present();
  }

  updateData(data) {
    console.log('updateData: data', data);
    if(data.value === '') return;
    this.db.updateWeight(data);
  }  
}
