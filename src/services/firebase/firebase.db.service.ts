import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import { Observable, Subscriber } from 'rxjs';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import firebase from 'firebase';
// import { User } from './vo/user';
// import { Log } from './vo/log';
// import { Info } from './vo/info';
// import { secretToken } from '../../scripts/config';


@Injectable()
export class DbService {
  
  rootRef;

  constructor() {
    console.log('DbService constructor');
    setTimeout(() => {
      this.rootRef = firebase.database().ref();
    });
  }

  uid() {
    return firebase.auth().currentUser.uid;
  }

  addTodo(value) {
    console.log('DB:: addTodo: ', value);
    value = pruneObj(value);
    value.createdAt = {
      ".sv": "timestamp"
    };
    value.lastModifiedAt = value.createdAt;
    return this.rootRef.child(`${this.uid()}/todos`).push(value);
  }

  getTodo(callback){

    console.log('DB: getTodo');
    const ref = this.rootRef.child(`${this.uid()}/todos`);
    
    ref.orderByChild('createdAt').on('value', (snap) => {
      
      var data = snap.val();
      var todos = [];

      console.log('DB: getTodo: onValue');

      snap.forEach((child) => {
        let todo = child.val();
        todo.key = child.key;
        todos.push(todo);
      });
      callback(todos);
    });
  }

  // getTodo(): Promise<any> {
  //   console.log('DB:: getTodo');
  //   const ref = this.rootRef.child(`${this.uid()}/todos`);
  //   return ref.once('value').then((snap) => {
  //     console.log('DB:: getTodo: ', snap.val());
  //     return snap.val();
  //   });
  // }
}

const pruneObj = (obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'undefined') {
      obj[key] = 'MISSING';
    }
  });
  return obj;
}
