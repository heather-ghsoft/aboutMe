import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Subscriber } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import firebase from 'firebase';
import { User } from './vo/user';
import { Log } from './vo/log';
import { Info } from './vo/info';
import { secretToken } from '../../scripts/config';


@Injectable()
export class DbService {
  rootRef;
  constructor(private http: Http) {
    setTimeout(() => this.rootRef = firebase.database().ref());
  }
}

