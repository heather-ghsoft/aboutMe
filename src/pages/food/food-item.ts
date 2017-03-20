import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionSheetController, AlertController } from 'ionic-angular';
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
  estmTrueArr = [];
  estimations = [];

  constructor(
    private dateService: DateService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // console.log('WeightItem:: ngOnInit: this.data: ', this.data);
    this.changeDataFormat(this.data);
  }

  changeDataFormat(data) {
    if (!data) return; 
    this.date = this.dateService.formatString2Date(data.date, data.time);
    this.estimations = this.data.estimations;
    this.estmTrueArr = this.estimations.filter((item) => {
      return item.answer;
    });

    if (this.data && !this.data.drinking) {
      this.data.drinking = {
        'answer': false,
        'desc': ''
      }
    }
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
    let alert = this.alertCtrl.create({
      title: '삭제하기',
      message: '삭제하시겠습니까?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.onDelete.next(this.data);
          }
        }
      ]
    });
    alert.present();
  }

  editData() {
    this.onEdit.next(this.data);
  }
}