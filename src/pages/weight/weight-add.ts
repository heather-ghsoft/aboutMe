import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { UtilService } from '../../services/utils/util.service';
import { DateService } from '../../services/utils/date.service';
import { ViewService }    from '../../services/view/view.service';
import { DbService } from '../../services/firebase/firebase.db.service';

import _ from "lodash";

@Component({
  selector: 'page-weight-add',
  templateUrl: 'weight-add.html'
})
export class WeightAddModal {

  data:any = {};

  isEdit:boolean = false;

  constructor(
    private params: NavParams,
    private db: DbService,
    private viewCtrl: ViewController,
    private utilService: UtilService,
    private dateService: DateService,
    private viewService: ViewService
  ) {

    let d = new Date();


    this.data = {
      date: dateService.formatDate2String(d, true),
      time: dateService.formatDate2TimeString(d, true),
      dateAt: d.getTime(),
      orderAt: 0
    };

    console.log('WeightAddModal: params1: ', this.params);
    
    this.data = _.assign(this.data, this.params.get('params'));
    console.log('WeightAddModal: data: ', this.data);

    if (this.data._id !== undefined) {
      this.isEdit = true;
    }
  }

  keypressNewData (event) {
    var code = event.keyCode || event.which;
    if( code === 13 )
    {
      if( event.srcElement.tagName === "INPUT" )
      {
        event.preventDefault();
        this.saveData();
      }
    }
  }

  saveData() {
    console.log('WeightAddModal:: addData: data', this.data);
    
    let d = this.dateService.formatString2Date(this.data.date, this.data.time);
    this.data.dateAt = d.dateObj.getTime();
    this.data.orderAt = this.utilService.getOrderTimeDesc(d.dateObj);
    
    if(this.data.value === '') return;

    if (!this.isEdit) {
      this.addData(this.data);
    } else {
      this.updateData(this.data);
    }
  }

  addData(data) {
    console.log('WeightAddModal:: addData: data', data);
    const completeLoading = this.viewService.showLoading();
    this.db.addWeight(data)
      .then(() => {
        completeLoading();
        this.dismiss();
      });
  }

  updateData(data) {
    console.log('WeightAddModal:: updateData: data', data);
    const completeLoading = this.viewService.showLoading();
    this.db.updateWeight(data)
      .then(() => {
        completeLoading();
        this.dismiss();
      });
  } 

  dismiss() {
    this.viewCtrl.dismiss(); 
  }
}