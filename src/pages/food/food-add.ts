import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { UtilService }    from '../../services/utils/util.service';
import { DateService }    from '../../services/utils/date.service';
import { ViewService }    from '../../services/view/view.service';
import { DbService }      from '../../services/firebase/firebase.db.service';
import { StorageService } from '../../services/firebase/firebase.storage.service';
import _ from "lodash";

const IMAGE_PICKER_OPTIONS = {
  maximumImagesCount: 1, 
  width: 300,
  height: 300,
  // quality of resized image, defaults to 100
  quality: 70
};

@Component({
  selector: 'page-food-add',
  templateUrl: 'food-add.html'
})
export class FoodAddModal {

  public base64Image: string;

  data:any = {};
  
  isEdit:boolean = false;
  displayPhoto = null;
  newPhoto = null;

  completeLoading: any;

  constructor(
    private params: NavParams,
    private db: DbService,
    private storage: StorageService,
    private viewCtrl: ViewController,
    private utilService: UtilService,
    private dateService: DateService,
    private viewService: ViewService
  ) {

    let d = new Date();
    let d2 = new Date( d );
    d2.setMinutes(d2.getMinutes() + 30);

    this.data = {
      food: '',
      photo: {
        fileName: null,
        url: null
      },
      date: dateService.formatDate2String(d, true),
      time: dateService.formatDate2TimeString(d, true),
      time2: dateService.formatDate2TimeString(d2, true),
      dateAt: d.getTime(),
      orderAt: 0,
      full: {
        start: 0,
        end: 5
      },
      estimations: [
        { question: '몸이 배고플 때 먹음', answer:false },
        { question: '조용한 환경에서 먹음', answer:false },
        { question: '앉아서만 먹음', answer:false },
        { question: '몸과 마음이 편안할 때만 먹음', answer:false },
        { question: '몸이 좋아하는 것만 먹음', answer:false },
        { question: '오직 음식에만 주의를 기울임', answer:false },
        { question: '천천히, 씹을 때마다 음미하면서 먹음', answer:false },
        { question: '포만감을 느끼기 전에 멈춤', answer:false }
      ]
    };

    this.data = _.assign(this.data, this.params.get('params'));
    this.displayPhoto = this.data.photo.url || null;

    console.log('FoodAddModal: data: ', this.data);

    if (this.data._id !== undefined) {
      this.isEdit = true;
    }
  }

  keypressNewData (event) {
    var code = event.keyCode || event.which;
    if( code === 13 )
    {
      if( event.srcElement.tagName === "INPUT" )
      {
        event.preventDefault();
        this.saveData();
      }
    }
  }

  dateTimeChaged() {
    console.log('dateTimeChaged');
    let d = this.dateService.formatString2Date(this.data.date, this.data.time);
    let tmpDate = d.dateObj;
    tmpDate.setMinutes(tmpDate.getMinutes() + 30);
    this.data.time2 = this.dateService.formatDate2TimeString(tmpDate, true);
  }

  showActionSheet(event) {
    event.stopPropagation();
    this.utilService.showPhotoActionSheet()
      .then((imageData) => {
        this.afterTakePicture(imageData);
      })
      .catch(error => {
        console.error('FoodAddModal:: showActionSheet: error: ', error.message);
      });
  }

  afterTakePicture(imageData) {
    
    console.log('FoodAddModal:: afterTakePicture: imageData: ', imageData !== undefined);
    if (imageData) {
      this.newPhoto = imageData;
      this.displayPhoto = 'data:image/jpeg;base64,' + imageData;
    }
  }

  saveData() {
    console.log('FoodAddModal:: addData: data', this.data);
    if (this.data.food === '') {
      return;
    }

    let d = this.dateService.formatString2Date(this.data.date, this.data.time);
    this.data.dateAt = d.dateObj.getTime();
    this.data.orderAt = this.utilService.getOrderTimeDesc(d.dateObj);

    this.data.full.start = Number(this.data.full.start);
    this.data.full.end = Number(this.data.full.end);

    if (!this.isEdit) {
      this.addData(this.data);
    } else {
      this.updateData(this.data);
    }
  }

  addData(data) {
    console.log('FoodAddModal:: addData: data', data);
    this.completeLoading = this.viewService.showLoading();
    this.db.addFood(data)
      .then(result => {
        this.uploadPhoto(result.key);
      });
  }

  updateData(data) {
    this.completeLoading = this.viewService.showLoading();
    this.db.updateFood(data)
      .then(result => {  
        console.log('FoodAddModal:: updateData: result: ', result);
        this.uploadPhoto(data._id);
      })
      .catch(error => {
        console.log('FoodAddModal:: updateData: error: ', error.message);
      });
  }

  uploadPhoto(key) {

    if(this.newPhoto === null) {
      this.completeLoading();
      this.dismiss();
    }
    this.storage.addFoodPhotos(key, this.newPhoto, this.data.photo.fileName)
      .then(() => {
        this.completeLoading();
        this.dismiss();
      })
      .catch(error => {
        console.log('FoodAddModal:: uploadPhoto: error: ', error.message);
        this.completeLoading();
        this.dismiss();
      });
  }

  dismiss() {
    console.log('FoodAddModal:: dismiss');
    this.viewCtrl.dismiss().catch((error) => console.log(error.message));
  }
}