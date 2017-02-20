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
  
  dataArr: Array<{title: string, desc: string}> = [];
  editMode: boolean;
  filter: string;
  newValue: string;

  constructor(
    private zone: NgZone,
    private db: DbService
  ) {
    
    console.log('TodoListPage: constructor');

    this.filter = 'ALL';

    this.getData();
  };

  ngOnInit() {
    console.log('TodoListPage: ngOnInit');
  }

  keypressNewData (event) {
    var code = event.keyCode || event.which;
    if( code === 13 )
    {
      if( event.srcElement.tagName === "INPUT" )
      {
        event.preventDefault();
        this.addData();
      }
    }
  }

  getData() {
    this.db.getTodo((dataArr) => {
      this.zone.run(() => this.dataArr = dataArr);
      console.log('TodoListPage:: getTodo: ', this.dataArr);
    });
  }

  // getTodo() {
  //   this.db.getTodo().then((dataArr) => {
      
  //     console.log(dataArr);
  //     this.dataArr = dataArr;
  //     console.log('TodoListPage:: getTodo: ', this.dataArr);
  //   });
  // }
  openAddData() {
    this.editMode = true;
  }

  addData() {
    if(this.newValue === '') return;

    let data = {
      value: this.newValue,
      completed: false
    }

    this.db.addTodo(data, () => {});

    this.newValue = "";
    this.editMode = false;
    
    // let todoAddModal = this.modalCtrl.create(TodoAddModal);
    // todoAddModal.onDidDismiss(data => {
    //   // firebase save
    //   if (data === null) return;
    //   this.db.addTodo(data);
    // });
    // todoAddModal.present();
  }  

  completeData(key, completed) {
    this.db.updateTodo({key, completed});
  }

  deleteData(key) {
    this.db.deleteTodo(key);
  }
}
