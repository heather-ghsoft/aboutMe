import { Component, Input, NgZone, ElementRef, Renderer } from '@angular/core';
import { Content } from 'ionic-angular';
import { DateService } from '../../services/utils/date.service';

@Component({
  selector: 'list-date-divider',
  template: `
    <div class="date_divider">
      {{title}}
    </div>
  `
})

// [ngClass]="isFixed ? 'dividerFixed' : 'dividerRelated'"

export class ListDateDivider {

  @Input() data;
  @Input() scrollTop;
  @Input() dividers;
  @Input() dateFormat: string;

  title = '';
  dividerIndex = 0;
  offsetTop = 0;
  date = {
    year: '',
    month: '',
    date: '',
    hour: '',
    minute: '',
    day: ''
  };
  isFixed = false;
  
  constructor(
    private zone: NgZone,
    private dateService: DateService,
    private elem: ElementRef,
    public renderer: Renderer
  ) {
  }

  ngOnInit() {
    this.changeDataFormat(this.data);
    this.makeTitle();
  }

  ngAfterViewInit() {
    this.initSetting()
    // this.makeTitle();
  }


  ngOnChanges(changes) {
    this.makeTitle();
    // this.changePosition(changes.scrollTop.previousValue, changes.scrollTop.currentValue);
  }

  changeDataFormat(data) {
    if (data === undefined || data.date === undefined) return; 
    this.date = this.dateService.formatString2Date(data.date, data.time);
  }

  makeTitle() {

    let _title = '';
    if (this.dateFormat) {
      if (this.dateFormat === 'YYYY년 MM월 dd일')
      _title = `${this.date.year}년 ${this.date.month}월 ${this.date.date}일 (${this.date.day})`;
    } else {
      _title = `${this.date.year}년 ${this.date.month}월`;
    }

    this.zone.run(() => {
      this.title = _title;
    });
  }

  initSetting() {
    this.renderer.setElementStyle(this.elem.nativeElement, 'width', '100%');
    this.dividerIndex = this.dividers.length;
    this.renderer.setElementStyle(this.elem.nativeElement, 'z-index', '9990');
    this.dividers.push({
      'fixed': (this.dividerIndex === 0) ? true : false,
      'offsetTop': this.elem.nativeElement.offsetTop,
      'year': this.date.year,
      'month': this.date.month,
      'date': this.date.date,
      'day': this.date.day
    });
    this.offsetTop = this.elem.nativeElement.offsetTop;
  }
  
  changePosition(previousTop, currentTop = 0) {

    if (this.dividers.length === 0) return;
    let _isFixed = true;

    if (previousTop <= currentTop) {
      // 스크롤 내릴 때
      if (currentTop + 24 > this.offsetTop) {
        this.renderer.setElementStyle(this.elem.nativeElement, 'display', 'none');
      } else {
        _isFixed = false;
      }
    } else {
      if (currentTop < this.offsetTop + 2) {
        if (this.dividerIndex !== 0) {
          this.renderer.setElementStyle(this.elem.nativeElement, 'display', 'block');
        }
        this.renderer.setElementStyle(this.elem.nativeElement, 'position', 'static');
        // this.renderer.setElementStyle(this.elem.nativeElement, 'top', '0px');
        _isFixed = false;
      }
    }
    console.log('changePosition:: this.dividers: ', this.dividers);
    this.zone.run(() => {
      this.isFixed = _isFixed;
      this.dividers[this.dividerIndex].fixed = _isFixed;
    });
  }

  moveScroll() {
    // const el:any = this.elem.nativeElement;
    //this.divider.push();
  }
}