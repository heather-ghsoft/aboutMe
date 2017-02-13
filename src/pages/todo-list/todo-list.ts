import { Component } from '@angular/core';
import { ModalController, ViewController, NavParams } from 'ionic-angular';
import { ViewService } from '../../services/view/view.service';

@Component({
  selector: 'page-todo-list',
  templateUrl: 'todo-list.html'
})

export class TodoListPage {
  constructor(
    private modalCtrl: ModalController
    // private viewService: ViewService
  ) {}

  addTodo() {
    console.log('addTodo');
    let todoAddModal = this.modalCtrl.create(TodoAdd);
    todoAddModal.onDidDismiss(data => {
      console.log(data);
    });
    todoAddModal.present();
  }  
}

@Component({
  selector: 'page-todo-add',
  templateUrl: 'todo-add.html'
})
class TodoAdd {

  constructor(private viewCtrl: ViewController) {

  }

  dismiss() {
   let data = { 'foo': 'bar' };
   this.viewCtrl.dismiss(data);
 }

}