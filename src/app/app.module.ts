import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { TodoListPage } from '../pages/todo-list/todo-list';
import { RegisterPage } from '../pages/register/register';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { TodoAddModal } from '../pages/todo-list/todo-add';

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    LoginPage,
    TodoListPage,
    RegisterPage,
    DashboardPage,
    TodoAddModal
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    LoginPage,
    TodoListPage,
    RegisterPage,
    DashboardPage,
    TodoAddModal
  ],
  providers: [{
    provide: ErrorHandler, 
    useClass: IonicErrorHandler
  }]
})
export class AppModule {}
