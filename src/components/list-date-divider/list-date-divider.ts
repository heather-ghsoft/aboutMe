import { Component, Input } from '@angular/core';
import { DateService } from '../../services/utils/date.service';

@Component({
  selector: 'list-date-divider',
  host: {'(window:scroll)': 'track($event)'},
  template: `
    <div class="date_divider">
      {{date.year}}년 {{date.month}}월
    </div>
  `
})

export class ListDateDivider {
  @Input() data;
  date;
  
  track($event) {
      // console.debug("Scroll Event", $event);
  }

  constructor(
    private dateService: DateService
  ) {
  }

  ngOnInit() {
    // console.log('ListDateDivider:: ngOnInit: this.data: ', this.data);
    this.changeDataFormat(this.data);
  }

  changeDataFormat(data) {

    if (!data) return; 
    this.date = this.dateService.formatString2Date(data.date, data.time);

    // this.year = tempDate[0];
    // this.month = tempDate[1];
    // this.date = tempDate[2];
    // this.hour = tempTime[0];
    // this.minute = tempTime[1];

    // let d = new Date(this.year, this.month, this.date);
    // console.log('WeightItem:: changeDataFormat: day: ', d.getDay());

    // this.day = this.dateService.getDayName(d.getDay());


  }
}