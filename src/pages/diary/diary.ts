import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalController, Content } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import { DiaryAddModal } from './diary-add';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html',
})

export class DiaryPage {

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
    private modalCtrl: ModalController
  ) {
    
    console.log('DiaryPage: constructor');

    this.getData();
  };

  ngOnInit() {
    console.log('DiaryPage: ngOnInit');
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) =>  {
      this.zone.run(() => this.scrollTop = event.scrollTop);
    });  
    this.content.ionScrollEnd.subscribe((event) =>  {
      this.zone.run(() => this.scrollTop = event.scrollTop);
    });  
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
    this.db.getDiaries(true, (dataArr) => {
      this.zone.run(() => this.dataArr = dataArr);
      console.log('DiaryPage:: getDiaries');
    });
  }

  // getDiary() {
  //   this.db.getDiary().then((diarys) => {
      
  //     console.log(diarys);
  //     this.diarys = diarys;
  //     console.log('DiaryPage:: getDiary: ', this.diarys);
  //   });
  // }
  openAddData() {
    let diaryAddModal = this.modalCtrl.create(DiaryAddModal);
    diaryAddModal.onDidDismiss(data => {
      // firebase save
      if (data === null) return;
      this.addData(data);
    });
    diaryAddModal.present();
  }

  addData(data) {
    console.log('DiaryPage:: addData: data', data);
    if(data.value === '') return;
    this.db.addDiary(data, () => {});
  }  

  deleteData(id) {
    this.db.deleteDiary(id);
  }

  editData(data) {
    let diaryAddModal = this.modalCtrl.create(DiaryAddModal, data);
    diaryAddModal.onDidDismiss(data => {
      // firebase save
      if (data === null) return;
      this.updateData(data);
    });
    diaryAddModal.present();
  }

  updateData(data) {
    console.log('DiaryPage:: updateData: data', data);
    if(data.value === '') return;
    this.db.updateDiary(data);
  } 

}
