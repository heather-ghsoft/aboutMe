import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { TodoListPage } from '../pages/todo-list/todo-list';
import { RegisterPage } from '../pages/register/register';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DiaryPage } from '../pages/diary/diary';
import { DiaryDayPage } from '../pages/diary/diary-day';
import { WeightPage } from '../pages/weight/weight';

import { TodoAddModal } from '../pages/todo-list/todo-add';

import { ZmCalendar } from '../components/calendar/zm-calendar';
import { ZmCalendarDay } from '../components/calendar/zm-calendar-day';

import { MapFilter } from '../components/filters/MapFilter';
import { TodoFilter } from '../pages/todo-list/todoFilter';

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    LoginPage,
    TodoListPage,
    RegisterPage,
    DashboardPage,
    DiaryPage,
    DiaryDayPage,
    WeightPage,
    TodoAddModal,
    ZmCalendar,
    ZmCalendarDay,
    MapFilter,
    TodoFilter
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
    DiaryPage,
    DiaryDayPage,
    WeightPage,
    TodoAddModal
  ],
  providers: [{
    provide: ErrorHandler, 
    useClass: IonicErrorHandler
  }]
})
export class AppModule {}
