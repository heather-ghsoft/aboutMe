import { Injectable } from '@angular/core';
import _ from "lodash";
import { UtilService } from '../utils/util.service';
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

  constructor(
    private util: UtilService
  ) {
    setTimeout(() => {
      console.log('DbService constructor');
      this.rootRef = firebase.database().ref();
    });
  }

  uid() {
    return firebase.auth().currentUser.uid;
  }

  addTodo(value, callback) {
    console.log('DB:: addTodo: ', value);
    let d = new Date();

    value = pruneObj(value);
    value.createdAt = {
      ".sv": "timestamp"
    };
    value.order = this.util.getOrderTimeDesc(d);
    value.lastModifiedAt = value.createdAt;
    return this.rootRef.child(`${this.uid()}/todos`).push(value).then(callback);
  }

  getTodo(callback){

    console.log('DB: getTodo');
    const ref = this.rootRef.child(`${this.uid()}/todos`);
    
    ref.orderByChild('order').on('value', (snap) => {
      
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

  updateTodo(data) {
    console.log('DB:: updateTodo: data: ', data);
    const ref = this.rootRef.child(`${this.uid()}/todos/${data.key}`);
    delete data.key;
    ref.update(data);
  }

  deleteTodo(key) {
    console.log('DB:: updateTodo: key: ', key);
    const ref = this.rootRef.child(`${this.uid()}/todos/${key}`);
    ref.remove();
  }

  // getTodo(): Promise<any> {
  //   console.log('DB:: getTodo');
  //   const ref = this.rootRef.child(`${this.uid()}/todos`);
  //   return ref.once('value').then((snap) => {
  //     console.log('DB:: getTodo: ', snap.val());
  //     return snap.val();
  //   });
  // }

  getWeights(callback) {
    console.log('DB: getWeights');
    const ref = this.rootRef.child(`${this.uid()}/weights`);
    
    ref.orderByChild('order').on('value', (snap) => {
      
      let dataArr = [];

      console.log('DB: getWeights: onValue');

      snap.forEach((child) => {
        let data = child.val();
        data.key = child.key;
        dataArr.push(data);
      });
      callback(dataArr);
    });
  }

  addWeight(value, callback) {
    console.log('DB:: addWeight: ', value);
    value = pruneObj(value);
    value.createdAt = {
      ".sv": "timestamp"
    };
    value.lastModifiedAt = value.createdAt;
    return this.rootRef.child(`${this.uid()}/weights`).push(value).then(callback);
  }

  updateWeight(value) {
    console.log('DB:: updateWeight: ', value);
    value = pruneObj(value);
    value.lastModifiedAt = {
      ".sv": "timestamp"
    };
    let key = value.key;
    delete value.key;
    return this.rootRef.child(`${this.uid()}/weights/${key}`).update(value);
  }

  deleteWeight(key) {
    console.log('DB:: deleteWeight: key: ', key);
    const ref = this.rootRef.child(`${this.uid()}/weights/${key}`);
    ref.remove();
  }
}

const pruneObj = (obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'undefined') {
      obj[key] = 'MISSING';
    }
  });
  return obj;
}
