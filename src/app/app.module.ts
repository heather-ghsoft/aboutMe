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
import { WeightAddModal } from '../pages/weight/weight-add';
import { WeightItem } from '../pages/weight/weight-item';

import { ZmCalendar } from '../components/calendar/zm-calendar';
import { ZmCalendarDay } from '../components/calendar/zm-calendar-day';

import { ListDateDivider } from '../components/list-date-divider/list-date-divider';

import { AuthService } from '../services/firebase/firebase.auth.service';
import { DbService } from '../services/firebase/firebase.db.service';
import { ViewService } from '../services/view/view.service';
import { UtilService } from '../services/utils/util.service';

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
    WeightAddModal,
    WeightItem,
    ZmCalendar,
    ZmCalendarDay,
    ListDateDivider,
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
    WeightAddModal 
  ],
  providers: [
    AuthService,
    DbService,
    ViewService,
    UtilService, 
    {
      provide: ErrorHandler, 
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}
