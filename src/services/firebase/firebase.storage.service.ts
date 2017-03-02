import { Injectable } from '@angular/core';
import { Info } from '../../info';
import 'firebase';
import { Observable, Observer } from 'rxjs';

declare var firebase: any;

@Injectable()
export class StorageService {
  rootRef: any;
  constructor() {
    setTimeout(() => {
      this.rootRef = firebase.storage().ref();
      console.log('firebase storage rootRef:', this.rootRef);
    });
  }

  getFileUrl(path:string): Promise<string> {
    return this.rootRef.child(path).getDownloadURL();
  }

  getFileMetadata(path:string): Promise<any> {
    return this.rootRef.child(path).getMetadata();
  }

  removeAvatar(userId: string): Promise<any> {
    const url = `avatars/${userId}/avatar.jpg`;
    return this.rootRef.child(url).delete();
  }

  uploadAvatarOf(userId: string, file: any): Observable<any> {
    const fileName = 'avatar.jpg';
    const url = `avatars/${userId}/${fileName}`;
    const metadata = {
      name: fileName,
      contentType: 'image/jpeg',
    };
    console.log('uploadAvatarOf', userId, url);
    console.log('file', file);
    const ref = this.rootRef.child(url);
    console.log('fulpath of new file', ref.fullPath);
    return toObservable(ref, file, metadata);
  }

  uploadAttachmentOfPost(postId: string, file: any): Observable<any> {
    const fileName = (file.hasOwnProperty('name') ? validateKey(file.name) : false) ? file.name : Date.now();
    console.log('uploadAttachmentOfPost: filename:', fileName);
    const url = `posts/${postId}/${fileName}`;

    const metadata = {
      name: fileName,
      contentType: 'image/jpeg',
    };
    const ref = this.rootRef.child(url);
    return toObservable(ref, file, metadata);
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
