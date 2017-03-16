import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { Camera, File, ImagePicker, ImagePickerOptions } from 'ionic-native';

@Injectable()
export class UtilService {

  constructor(
    private actionSheetCtrl: ActionSheetController
  ) {
    
  }

  getOrderTimeDesc(date) {
    return 9999999999999 - date.getTime();
  }

  showPhotoActionSheet(): Promise<any> {

    return new Promise ((resolve, reject) => {
      let actionSheet = this.actionSheetCtrl.create({
        title: '사진 가져오기',
        buttons: [
          {
            text: '카메라',
            handler: () => {
              console.log('Camera clicked');
              this.takePicture(Camera.PictureSourceType.CAMERA, resolve, reject);
            }
          },
          {
            text: '라이브러리',
            handler: () => {
              console.log('Library clicked');
              this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY, resolve, reject);
              // this.getPhotoFromLibrary();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              resolve();
            }
          }
        ]
      });
      actionSheet.present();
    });
  }

  takePicture(sourceType, resolve, reject) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      correctOrientation: true,
      destinationType : Camera.DestinationType.DATA_URL,
      allowEdit : true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: false 
    };
   
    // Get the data of an image
    Camera.getPicture(options).then((imageData) => {
      console.error('utilService:: takePicture: success');
      resolve(imageData);
    }, (err) => {
      console.error('utilService:: takePicture: failed', err);
      reject(err);
    });
  }
}