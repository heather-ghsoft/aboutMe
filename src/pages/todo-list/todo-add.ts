import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { ViewService } from '../../services/view/view.service';

@Component({
  selector: 'page-todo-add',
  templateUrl: 'todo-add.html'
})
export class TodoAddModal {

  todo = {};

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {

    this.todo = {
      title: '',
      desc: '',
      completed: false,
      deleted: false,
    }
  }

  saveTodo() {
    let data = this.todo;
    this.dismiss(data);
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data); 
  }

}