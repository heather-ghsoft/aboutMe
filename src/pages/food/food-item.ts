import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { DateService } from '../../services/utils/date.service';

@Component({
  selector: 'food-item',
  templateUrl: 'food-item.html'
})

// <div class="div_date3">
//   <div class="p_day">{{day}}요일</div>
// </div>

export class FoodItem {
  @Input() data;
  @Input() dateFormat;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  title;
  date;

  constructor(
    private dateService: DateService,
    private actionSheetCtrl: ActionSheetController
  ) {
  }

  ngOnInit() {
    // console.log('WeightItem:: ngOnInit: this.data: ', this.data);
    this.changeDataFormat(this.data);
  }

  changeDataFormat(data) {
    if (!data) return; 
    this.date = this.dateService.formatString2Date(data.date, data.time);
  }

  moreMenu() {

    event.stopPropagation();
    let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: '수정하기',
            handler: () => {
              this.editData();
            }
          },
          {
            text: '삭제하기',
            handler: () => {
              this.deleteData();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      actionSheet.present();
  }

  deleteData() {
    this.onDelete.next(this.data._id);
  }

  editData() {
    this.onEdit.next(this.data);
  }
}