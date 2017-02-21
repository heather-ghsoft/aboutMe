import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import d3 from 'd3'
import { DbService } from '../../services/firebase/firebase.db.service';

@Component({
  selector: 'page-weight-chart',
  templateUrl: 'weight-chart-d3.html'
})

export class WeightChartD3Page {

  dataArr = [];

  constructor(
    private navCtrl: NavController,
    private db: DbService,
    private zone: NgZone
  ) {
    this.getData();
    console.log('WeightChartPage:: constructor');
  }

  ngOnInit() {
    console.log('WeightChartPage:: ngOnInit');
  }

  getData() {
    // this.dataArr = [10,20,30,40,60];
    this.db.getWeights(false, (dataArr) => {
      this.zone.run(() => this.dataArr = dataArr);
      console.log('WeightChartPage:: getData');
    });
  }
}