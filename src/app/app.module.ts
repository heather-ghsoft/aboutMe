import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { TodoListPage } from '../pages/todo-list/todo-list';
import { RegisterPage } from '../pages/register/register';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { CalendarPage } from '../pages/calendar/calendar';
import { DiaryPage } from '../pages/diary/diary';
import { DiaryDayPage } from '../pages/diary/diary-day';
import { WeightPage } from '../pages/weight/weight';
import { WeightAddModal } from '../pages/weight/weight-add';
import { WeightChartPage } from '../pages/weight-chart/weight-chart';
import { WeightItem } from '../pages/weight/weight-item';

import { ZmCalendar } from '../components/calendar/zm-calendar';
import { ZmCalendarDay } from '../components/calendar/zm-calendar-day';

import { ListDateDivider } from '../components/list-date-divider/list-date-divider';

import { ZmLineChart } from '../directives/line-chart/zm-line-chart';

import { AuthService } from '../services/firebase/firebase.auth.service';
import { DbService } from '../services/firebase/firebase.db.service';
import { ViewService } from '../services/view/view.service';
import { UtilService } from '../services/utils/util.service';

import { MapFilter } from '../filters/MapFilter';
import { TodoFilter } from '../pages/todo-list/todoFilter';

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    LoginPage,
    TodoListPage,
    RegisterPage,
    DashboardPage,
    CalendarPage,
    WeightPage,
    WeightAddModal,
    WeightItem,
    WeightChartPage,
    DiaryPage,
    DiaryDayPage,
    ZmCalendar,
    ZmCalendarDay,
    ListDateDivider,
    ZmLineChart,
    MapFilter,
    TodoFilter
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    LoginPage,
    TodoListPage,
    RegisterPage,
    DashboardPage,
    CalendarPage,
    WeightPage,
    WeightAddModal,
    WeightChartPage,
    DiaryPage,
    DiaryDayPage
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
