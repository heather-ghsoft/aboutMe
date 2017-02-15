import { Component, NgZone } from '@angular/core';
import { DbService } from '../../services/firebase/firebase.db.service';
import { ViewService } from '../../services/view/view.service';
// import { TodoAddModal } from './todo-add';
// import { TodoFilter } from './todoFilter';

@Component({
  selector: 'page-todo-list',
  templateUrl: 'todo-list.html',
})

export class TodoListPage {
  
  todos: Array<{title: string, desc: string}> = [];
  editMode: boolean;
  filter: string;
  newTodo: string;

  constructor(
    private zone: NgZone,
    private db: DbService
  ) {
    
    console.log('TodoListPage: constructor');

    this.filter = 'ALL';

    this.getTodo();
  };

  ngOnInit() {
    console.log('TodoListPage: ngOnInit');
  }

  keypressNewTodo (event) {
    var code = event.keyCode || event.which;
    if( code === 13 )
    {
      if( event.srcElement.tagName === "INPUT" )
      {
        event.preventDefault();
        this.addTodo();
      }
    }
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
  openAddTodo() {
    this.editMode = true;
  }

  addTodo() {
    if(this.newTodo === '') return;

    let todo = {
      title: this.newTodo,
      completed: false
    }

    this.db.addTodo(todo, () => {});

    this.newTodo = "";
    this.editMode = false;
    
    // let todoAddModal = this.modalCtrl.create(TodoAddModal);
    // todoAddModal.onDidDismiss(data => {
    //   // firebase save
    //   if (data === null) return;
    //   this.db.addTodo(data);
    // });
    // todoAddModal.present();
  }  

  completeTodo(key, completed) {
    this.db.updateTodo({key, completed});
  }

  deleteTodo(key) {
    this.db.deleteTodo(key);
  }
}
