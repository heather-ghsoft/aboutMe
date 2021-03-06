import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalController, Content } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import { WeightAddModal } from './weight-add';

@Component({
  selector: 'page-weight',
  templateUrl: 'weight.html',
})

export class WeightPage {

  @ViewChild(Content) content: Content;
  
  dataArr: Array<any> = [];
  editMode: boolean;
  newValue: string = "";
  newDate: Date = new Date();
  scrollTop: number = 0;
  dividers: any[] = [];

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

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      this.saveScrollTop(event.scrollTop);
    });  
    this.content.ionScrollEnd.subscribe((event) =>  {
      this.saveScrollTop(event.scrollTop);
    });  
  }

  ngOnChanges(changes) {
    console.log('WeightPage:: changes: ', changes);
  }

  // previousTop = 0;
  saveScrollTop(scrollTop) {
    for(let i = 0; i < this.dividers.length; i++) {
      const divider = this.dividers[i];
      if ((scrollTop + 100 > divider.offsetTop && !divider.fixed) || (scrollTop < divider.offsetTop + 40 && divider.fixed)) {
        this.zone.run(() => this.scrollTop = scrollTop);
        break;
      }
    }
  }

  getData() {
    this.db.getWeights(true, (dataArr) => {
      this.zone.run(() => this.dataArr = dataArr);
      console.log('WeightListPage:: getWeight');
    });
  }

  openAddData() {
    let weightAddModal = this.modalCtrl.create(WeightAddModal);
    weightAddModal.onDidDismiss(data => {
      // firebase save
      if (data === null) return;
      // this.addData(data);
    });
    weightAddModal.present();
  }

  deleteData(id) {
    this.db.deleteWeight(id);
  }

  editData(data) {
    let weightAddModal = this.modalCtrl.create(WeightAddModal, {params: data});
    weightAddModal.onDidDismiss(data => {});
    weightAddModal.present();
  }
}
