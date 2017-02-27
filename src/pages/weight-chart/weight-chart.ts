import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbService } from '../../services/firebase/firebase.db.service';
import _ from "lodash";

@Component({
  selector: 'page-weight-chart',
  templateUrl: 'weight-chart.html'
})

export class WeightChartPage {

  yMin:number;
  yMax:number;

// lineChart
  lineChartData:Array<any> = [{data:[], label:'weight'}];
  lineChartLabels:Array<any> = [];
  lineChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: { 
          beginAtZero: false,
          stepSize: 1
        }
      }],
      xAxes: [{
          type: 'time',
          time: {
              displayFormats: {
                  quarter: 'MM D'
              }
          }
      }]
    }
  };
  lineChartColors:Array<any> = [
    { // grey
      backgroundColor: '#ffced0',
      borderWidth: '2',
      borderColor: '#ffa0a3',
      pointRadius: '3',
      pointBorderWidth: '1',
      pointBackgroundColor: '#fff',
      pointBorderColor: '#ffa0a3',
      pointHoverBackgroundColor: '#ff5a5f',
      pointHoverBorderColor: 'ff5a5f'
    }
  ];
  lineChartLegend:boolean = false;
  lineChartType:string = 'line';
  weightColX = 'dateAt';
  weightColY = 'value';

  constructor(
    private navCtrl: NavController,
    private db: DbService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.getData();
  }
 
  getData() {
    this.db.getWeights(false, (weightData) => {
      this.zone.run(() => this.getGraphWeightData(weightData));
    });
  }

  // 체중 데이터를 데이터 형식에 맞게 가공한다. 
  getGraphWeightData(weightData) {

    let _xArr: any[] = [];    // x축 데이터
    let _yArr: number[] = [];    // y축 데이터 
    let _ticks: any;

    // data 에서 x, y 축의 데이터에 맞게 변환
    weightData.forEach((item) => {
      // _xArr.push(this.getColXData(item[this.weightColX]));
      _xArr.push(this.getColXData(item[this.weightColX]));
      _yArr.push(this.getColYData(item[this.weightColY]));
    })

    // chart data binding
    this.lineChartLabels = _xArr;
    this.lineChartData.forEach(arr => {
      if (arr.label === 'weight') {
        arr.data = _yArr;
      }
    });
    // -

    this.setChartYAxesSize(_yArr);
  }

  // chart option: y축 min, max 값 계산 후 변경 
  setChartYAxesSize(_yArr) 
  {
    let _ticks = this.lineChartOptions.scales.yAxes[0].ticks;
    _ticks.max = _.max(_yArr) + 2;
    _ticks.min = _.min(_yArr) - 5;
  }

  getColXData(x: number): any {
  
    let _d = new Date(x);
    return _d;//_.toString(_d.getDate());
  }

  getColYData(y) {
    return Number(y);
  }

  // events
  chartClicked(e:any):void {
    console.log(e);
  }
 
  chartHovered(e:any):void {
    console.log(e);
  }
}