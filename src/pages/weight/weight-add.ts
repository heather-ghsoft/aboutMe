import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { UtilService } from '../../services/utils/util.service';

@Component({
  selector: 'page-weight-add',
  templateUrl: 'weight-add.html'
})
export class WeightAddModal {

  data = {
    key: '',
    value: '',
    date: '',
    time: '',
    order: 0
  };

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private util: UtilService
  ) {

    let d = new Date();

    this.data.key = this.params.get('key');
    this.data.value = this.params.get('value');
    this.data.date = this.params.get('date') || (d.getFullYear() + '-' + ( d.getMonth() < 10 ? '0' : '' ) + (d.getMonth() + 1) + '-' + d.getDate());
    this.data.time = this.params.get('time') || ((d.getHours() < 10 ? '0': '') + d.getHours() + ':' + ( d.getMinutes() < 10 ? '0' : '' ) + d.getMinutes());
    console.log('WeightAddModal: data: ', this.data);
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
    let d = this.util.changeDataFormat(this.data.date, this.data.time);
    this.data.order = this.util.getOrderTimeDesc(d.dateObj);
    this.dismiss(this.data);
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data); 
  }
}