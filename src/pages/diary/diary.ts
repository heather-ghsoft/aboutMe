import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
// import { ViewService } from '../../services/view/view.service';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})

export class DiaryPage {

  constructor(
    private db: DbService
  ) {}

  ngOnInit() {

  }
  
}