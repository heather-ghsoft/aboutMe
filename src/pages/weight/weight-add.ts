import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { UtilService } from '../../services/utils/util.service';
import { DateService } from '../../services/utils/date.service';
import { DbService } from '../../services/firebase/firebase.db.service';

@Component({
  selector: 'page-weight-add',
  templateUrl: 'weight-add.html'
})
export class WeightAddModal {

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
    private db: DbService,
    private viewCtrl: ViewController,
    private utilService: UtilService,
    private dateService: DateService
  ) {

    let d = new Date();

    this.data._id = this.params.get('_id');
    this.data.value = this.params.get('value');
    this.data.date = this.params.get('date') || dateService.formatDate2String(d, true);
    this.data.time = this.params.get('time') || dateService.formatDate2TimeString(d, true);
    this.data.dateAt = this.params.get('dateAt') || d.getTime();
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
    console.log('WeightAddModal:: addData: data', this.data);
    
    let d = this.dateService.formatString2Date(this.data.date, this.data.time);
    this.data.dateAt = d.dateObj.getTime();
    this.data.orderAt = this.utilService.getOrderTimeDesc(d.dateObj);
    
    if(this.data.value === '') return;

    this.db.addWeight(this.data, () => {
      this.dismiss();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss(); 
  }
}