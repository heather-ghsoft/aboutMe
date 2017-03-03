import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Camera, File, ImagePicker, ImagePickerOptions } from 'ionic-native';
import { UtilService }    from '../../services/utils/util.service';
import { DateService }    from '../../services/utils/date.service';
import { ViewService }    from '../../services/view/view.service';
import { DbService }      from '../../services/firebase/firebase.db.service';
import { StorageService } from '../../services/firebase/firebase.storage.service';

const IMAGE_PICKER_OPTIONS = {
  maximumImagesCount: 1, 
  width: 300,
  height: 300,
  // quality of resized image, defaults to 100
  quality: 70
};

@Component({
  selector: 'page-diary-add',
  templateUrl: 'diary-add.html'
})
export class DiaryAddModal {

  public base64Image: string;

  data = {
    _id: '',
    title: '',
    content: '',
    date: '',
    time: '',
    dateAt: 0,
    orderAt: 0,
    photos: []
  };
  
  newPhotos: any[] = [];
  isPhotoChaged: boolean = false;

  constructor(
    private params: NavParams,
    private db: DbService,
    private storage: StorageService,
    private viewCtrl: ViewController,
    private utilService: UtilService,
    private dateService: DateService,
    private viewService: ViewService,
    private actionSheetCtrl: ActionSheetController
  ) {

    let d = new Date();

    this.newPhotos = [];
    this.data.photos = this.params.get('photos') || [];
    this.data._id = this.params.get('_id');
    this.data.title = this.params.get('title') || '';
    this.data.content = this.params.get('content') || '';
    this.data.date = this.params.get('date') || dateService.formatDate2String(d, true);
    this.data.time = this.params.get('time') || dateService.formatDate2TimeString(d, true);
    this.data.dateAt = this.params.get('dateAt') || d.getTime();
    console.log('DiaryAddModal: data: ', this.data);
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

  showActionSheet(event) {
    event.stopPropagation();
    let actionSheet = this.actionSheetCtrl.create({
      title: '사진 가져오기',
      buttons: [
        {
          text: '카메라',
          handler: () => {
            console.log('Camera clicked');
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: '라이브러리',
          handler: () => {
            console.log('Library clicked');
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
            // this.getPhotoFromLibrary();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      correctOrientation: true,
      destinationType : Camera.DestinationType.DATA_URL,
      allowEdit : true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false 
    };
   
    // Get the data of an image
    Camera.getPicture(options).then((imageData) => {
      this.newPhotos.push(imageData);
    }, (err) => {
      // this.presentToast('Error while selecting image.');
      console.error('getPhotoFromLibrary failed', err);
    });
  }

  saveData() {
    console.log('DiaryAddModal:: addData: data', this.data);
    
    if (this.newPhotos.length === 0 && this.data.content === '' && this.data.title === '') {
      return;
    }

    const completeLoading = this.viewService.showLoading();

    let d = this.dateService.formatString2Date(this.data.date, this.data.time);
    this.data.dateAt = d.dateObj.getTime();
    this.data.orderAt = this.utilService.getOrderTimeDesc(d.dateObj);

    this.db.addDiary(this.data, (result) => {
      console.log('result: ', result.key);
      this.storage.addDiaryPhotos(result.key, this.data.photos, this.newPhotos, this.isPhotoChaged, () => {
          completeLoading();
          this.dismiss();
        });
    });
  }

  dismiss() {
    this.viewCtrl.dismiss(); 
  }
}