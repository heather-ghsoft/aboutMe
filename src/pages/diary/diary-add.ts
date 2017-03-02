import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { UtilService } from '../../services/utils/util.service';
import { DateService } from '../../services/utils/date.service';

@Component({
  selector: 'page-diary-add',
  templateUrl: 'diary-add.html'
})
export class DiaryAddModal {

  data = {
    _id: '',
    value: '',
    date: '',
    time: '',
    dateAt: 0,
    orderAt: 0
  };

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private utilService: UtilService,
    private dateService: DateService
  ) {

    let d = new Date();

    this.data._id = this.params.get('_id');
    this.data.value = this.params.get('value');
    this.data.date = this.params.get('date') || (d.getFullYear() + '-' + ( d.getMonth() < 10 ? '0' : '' ) + (d.getMonth() + 1) + '-' + d.getDate());
    this.data.time = this.params.get('time') || ((d.getHours() < 10 ? '0': '') + d.getHours() + ':' + ( d.getMinutes() < 10 ? '0' : '' ) + d.getMinutes());
    this.data.dateAt = this.params.get('dateAt') || d.getTime();
    console.log('DiaryAddModal: data: ', this.data);
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
    let d = this.dateService.formatString2Date(this.data.date, this.data.time);
    this.data.dateAt = d.dateObj.getTime();
    this.data.orderAt = this.utilService.getOrderTimeDesc(d.dateObj);
    this.dismiss(this.data);
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data); 
  }
}