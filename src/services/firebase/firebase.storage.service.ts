import { Injectable } from '@angular/core';
import { Info } from '../../info';
import firebase from 'firebase';
import { Observable, Observer } from 'rxjs';
import { DateService } from '../utils/date.service';

@Injectable()
export class StorageService {
  dataRef: any;
  storageRef: any;
  constructor(
    private dateService: DateService
  ) {
    setTimeout(() => {
      this.dataRef = firebase.database().ref();
      this.storageRef = firebase.storage().ref();
    });
  }

  uid() {
    return firebase.auth().currentUser.uid;
  }

  // addDiaryPhotos(id, photos): firebase.Promise<any> {
  addDiaryPhotos(id, photos, newPhotos, isPhotoChaged, callback) {

    if (photos !== null) {


      if (isPhotoChaged) {
        for (let i = 0; i < photos.length; i++) {
          let index = i;
          this.dataRef.child(`${this.uid()}/diary/${id}/photos/${index}`)
            .set(photos[i]);
        }
      }

      let count = 0;
      for (let i = 0; i < newPhotos.length; i++) {
        // console.log('Storage:: addDiaryPhotos: photo: ', photos[i]);
        let fileName = this.createFileName(i);
        this.storageRef.child(`${this.uid()}/diary/${id}/${fileName}.png`)
          .putString(newPhotos[i], firebase.storage.StringFormat.BASE64, {contentType: 'image/png'})
          .then((savedPhoto) => {
            console.log('Storage:: addDiaryPhotos: downloadURL: ', savedPhoto.downloadURL);
            let index = photos.length + i;
            this.dataRef.child(`${this.uid()}/diary/${id}/photos/${index}`)
              .set(savedPhoto.downloadURL);
          })
          .then((result) => {
            count++;
            if (count === newPhotos.length) {
              callback();
            }
          })
          .catch((err) => {
            console.log('Storage:: addDiaryPhotos: err: ', err);
            callback();
          }); 
      }
    }
  }

  addFoodPhotos(id, newPhoto): firebase.Promise<any> {

    if (newPhoto === null) {
      return;
    }

    // 저장할 사진이 있으면 같은 파일에 엎어친다. 동일이름으로 저장 
    console.log('Storage:: addFoodPhotos: newPhoto: ', newPhoto);
    
    let fileName = `food.png`; // `${this.createFileName('')}.png`;

    return this.storageRef.child(`${this.uid()}/foods/${id}/${fileName}`)
      .putString(newPhoto, firebase.storage.StringFormat.BASE64, {contentType: 'image/png'})
      .then((savedPhoto) => {
        console.log('Storage:: addFoodPhotos: downloadURL: ', savedPhoto.downloadURL);
        this.dataRef.child(`${this.uid()}/foods/${id}/photo`)
          .set({
            fileName: fileName,
            url: savedPhoto.downloadURL
          });
      }); 
  }

  deleteFoodPhotos(id, fileName, deleteDb): firebase.Promise<any> {
    console.log('Storage:: deleteFoodPhotos: id:', id);
    return this.storageRef.child(`${this.uid()}/foods/${id}/${fileName}`).delete()
      .then(() => {
        if (deleteDb) this.dataRef.child(`${this.uid()}/foods/${id}/photo`).delete();
      })
      .catch(error => console.log('Storage:: deleteFoodPhotos: id: error: ', error.message));
  }


  createFileName(tailName) {
    let d = new Date();
    if (tailName.length) {
      tailName = `_${tailName}`;
    }
    return `${this.dateService.formatDate2String(d, true)} ${this.dateService.formatDate2TimeString(d, true)}${tailName}`;
  }
}

const toObservable = (ref, file: any, metadata?: any) => {
  return Observable.create( observer => {
    // Upload the file to the path 'images/rivers.jpg'
    // We can use the 'name' property on the File API to get our file name
    var uploadTask = ref.put(file, metadata);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    const unsubscribe = uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // See below for more detail
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');

      var downloadURL = uploadTask.snapshot.downloadURL;
      observer.next({progress, downloadURL});
    }, function(error) {
      // Handle unsuccessful uploads
      unsubscribe();
      observer.error(error);
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      unsubscribe();
      observer.complete();
    });
  });
}

const validateKey = (val) => {
  return val.search(/[#.$/[\]]/) < 0;
}
