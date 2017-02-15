import { Component, NgZone } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import { ViewService } from '../../services/view/view.service';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})

export class DiaryPage {

  constructor(
    private db: DbService
  ) {}

  
}