import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from '../../services/utils/util.service';

@Component({
  selector: 'weight-item',
  template: `
    <ion-item-sliding>
      <ion-item>
        <div class="box_item">
          <div class="item_left">
            <div class="item_date">
              {{date.date}}
            </div>
          </div>
          <div class="item_content">
            <div class="item_value">{{data.value}} kg</div>
            <div class="item_time">{{date.year}}년 {{date.month}}월 {{date.date}}일 ({{date.day}}) {{date.hour}}시 {{date.minute}}분</div>
          </div>
        </div>
      </ion-item>
      <ion-item-options>
        <button ion-button item-left color="sea" (click)=" this.editData(data) ">
          Edit
        </button>
        <button ion-button item-left color="danger" (click)=" this.deleteData(data.key) ">
          Delete
        </button>
      </ion-item-options>
    </ion-item-sliding>
  `
})

// <div class="div_date3">
//   <div class="p_day">{{day}}요일</div>
// </div>

export class WeightItem {
  @Input() data;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  date;

  constructor(
    private util: UtilService
  ) {
  }

  ngOnInit() {
    // console.log('WeightItem:: ngOnInit: this.data: ', this.data);
    this.changeDataFormat(this.data);
  }

  changeDataFormat(data) {
    if (!data) return; 
    this.date = this.util.changeDataFormat(data.date, data.time);
  }

  deleteData(key) {
    this.onDelete.next(key);
  }

  editData(data) {
    this.onEdit.next(data);
  }
}