import { Component, NgZone } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import { ViewService } from '../../services/view/view.service';
import { TodoAddModal } from './todo-add';

@Component({
  selector: 'page-todo-list',
  templateUrl: 'todo-list.html'
})

export class TodoListPage {
  
  todos: Array<{title: string, desc: string}>;

  constructor(
    private modalCtrl: ModalController,
    private zone: NgZone,
    private db: DbService
  ) {
    console.log('TodoListPage: constructor');
    this.getTodo();
  };

  ngOnInit() {
    console.log('TodoListPage: ngOnInit');
  }

  getTodo() {
    this.db.getTodo((todos) => {
      this.zone.run(() => this.todos = todos);
      console.log('TodoListPage:: getTodo: ', this.todos);
    });
  }

  // getTodo() {
  //   this.db.getTodo().then((todos) => {
      
  //     console.log(todos);
  //     this.todos = todos;
  //     console.log('TodoListPage:: getTodo: ', this.todos);
  //   });
  // }

  addTodo() {
    let todoAddModal = this.modalCtrl.create(TodoAddModal);
    todoAddModal.onDidDismiss(data => {
      // firebase save
      if (data === null) return;
      this.db.addTodo(data);
    });
    todoAddModal.present();
  }  
}
