import { Injectable } from '@angular/core';
// import _ from "lodash";
import { UtilService } from '../utils/util.service';
// import { Http } from '@angular/http';
// import { Observable, Subscriber } from 'rxjs';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import firebase from 'firebase';
import { Weight } from '../../vo/weight';
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
      console.log('DbService:: constructor');
      this.rootRef = firebase.database().ref();
    });
  }

  uid() {
    return firebase.auth().currentUser.uid;
  }

  addTodo(value, callback) {
    console.log('DbService:: addTodo: ', value);
    let d = new Date();

    value.createdAt = { ".sv": "timestamp" };
    value.orderAt = this.util.getOrderTimeDesc(d);
    value.lastModifiedAt = value.createdAt;

    value = pruneObj(value);
    return this.rootRef.child(`${this.uid()}/todos`).push(value).then(callback);
  }

  getTodo(callback){

    console.log('DbService: getTodo');
    const ref = this.rootRef.child(`${this.uid()}/todos`);
    
    ref.orderByChild('order').on('value', (snap) => {
      
      let dataArr = [];
      snap.forEach((child) => {
        dataArr.push(convertSnap2Object(child));
      });
      callback(dataArr);
    });
  }

  updateTodo(value) {
    console.log('DbService:: updateTodo: value: ', value);
    const ref = this.rootRef.child(`${this.uid()}/todos/${value._id}`);
    delete value._id;

    value = pruneObj(value);
    ref.update(value);
  }

  deleteTodo(id) {
    console.log('DbService:: updateTodo: id: ', id);
    const ref = this.rootRef.child(`${this.uid()}/todos/${id}`);
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

  getWeights(isDesc, callback) {
    console.log('DbService: getWeights');
    const ref = this.rootRef.child(`${this.uid()}/weights`);
    const descCol = isDesc ? 'orderAt': 'dateAt';

    ref.orderByChild(descCol).on('value', (snap) => {
      
      let dataArr = [];

      console.log('DbService: getWeights: onValue');

      snap.forEach((child) => {
        dataArr.push(convertSnap2Object(child));
      });
      callback(dataArr);
    });
  }

  getWeights_calendar(startDate, endDate, callback) {
    console.log('DbService: getWeights_calendar');
    const ref = this.rootRef.child(`${this.uid()}/weights`);

    ref.orderByChild('dateAt')
      .startAt(startDate.getTime())
      .endAt(endDate.getTime())
      .on('value', (snap) => {
      
        let dataArr = [];

        console.log('DbService: getWeights: onValue');

        snap.forEach((child) => {
          dataArr.push(convertSnap2Object(child));
        });
        callback(dataArr);
      });
  }

  addWeight(value, callback) {
    console.log('DbService:: addWeight: value: ', value);
    value.createdAt = { ".sv": "timestamp" };
    value.lastModifiedAt = value.createdAt;
    delete value._id;
    
    value = pruneObj(value);
    return this.rootRef.child(`${this.uid()}/weights`).push(value).then(callback);
  }

  updateWeight(value) {
    console.log('DbService:: updateWeight: value: ', value);
    const ref = this.rootRef.child(`${this.uid()}/weights/${value._id}`);

    value.lastModifiedAt = { ".sv": "timestamp" };
    delete value._id;

    value = pruneObj(value);
    return ref.update(value);
  }

  deleteWeight(id) {
    console.log('DbService:: deleteWeight: id: ', id);
    const ref = this.rootRef.child(`${this.uid()}/weights/${id}`);
    ref.remove();
  }


  getDiaries(isDesc, callback) {
    console.log('DbService: getDiary');
    const ref = this.rootRef.child(`${this.uid()}/diary`);
    const descCol = isDesc ? 'orderAt': 'dateAt';

    ref.orderByChild(descCol).on('value', (snap) => {
      
      let dataArr = [];

      console.log('DbService: getDiary: onValue');

      snap.forEach((child) => {
        dataArr.push(convertSnap2Object(child));
      });
      callback(dataArr);
    });
  }

  getDiaryList_calendar(startDate, endDate, callback) {
    console.log('DbService: getDiary_calendar');
    const ref = this.rootRef.child(`${this.uid()}/diary`);

    ref.orderByChild('dateAt')
      .startAt(startDate.getTime())
      .endAt(endDate.getTime())
      .on('value', (snap) => {
      
        let dataArr = [];

        console.log('DbService: getDiary: onValue');

        snap.forEach((child) => {
          dataArr.push(convertSnap2Object(child));
        });
        callback(dataArr);
      });
  }

  getDiary(id, callback) {
    console.log('DbService: getDiary: id: ', id);
    const ref = this.rootRef.child(`${this.uid()}/diary/${id}`);

    ref.on('value', (snap) => {
      callback(convertSnap2Object(snap));
    });
  }

  addDiary(value, callback) {
    console.log('DbService:: addDiary: value: ', value);
    value.createdAt = { ".sv": "timestamp" };
    value.lastModifiedAt = value.createdAt;
    delete value._id;
    
    value = pruneObj(value);
    return this.rootRef.child(`${this.uid()}/diary`).push(value).then(callback);
  }

  updateDiary(value) {
    console.log('DbService:: updateDiary: value: ', value);
    const ref = this.rootRef.child(`${this.uid()}/diary/${value._id}`);

    value.lastModifiedAt = { ".sv": "timestamp" };
    delete value._id;

    value = pruneObj(value);
    return ref.update(value);
  }

  deleteDiary(id) {
    console.log('DbService:: deleteDiary: id: ', id);
    const ref = this.rootRef.child(`${this.uid()}/diary/${id}`);
    ref.remove();
  }
}

const convertSnap2Object = (child) => {
  let data = child.val();

  data._id = child.key;
  return data;
}

const pruneObj = (obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'undefined') {
      obj[key] = 'MISSING';
    }
  });
  return obj;
}
