import { Component, Input, NgZone, ElementRef, Renderer } from '@angular/core';
import { Content } from 'ionic-angular';
import { DateService } from '../../services/utils/date.service';

@Component({
  selector: 'list-date-divider',
  template: `
    <div class="date_divider">
      {{date.year}}년 {{date.month}}월
    </div>
  `
})

// [ngClass]="isFixed ? 'dividerFixed' : 'dividerRelated'"

export class ListDateDivider {

  @Input() data;
  @Input() scrollTop;
  @Input() dividers;
  @Input('isFixedOnTop') isFixedOnTop;

  dividerIndex = 0;
  offsetTop = 0;
  date = {
    year: '',
    month: ''
  };
  isFixed = false;
  fixedOnTop = false;
  
  constructor(
    private zone: NgZone,
    private dateService: DateService,
    private elem: ElementRef,
    public renderer: Renderer
  ) {
  }

  ngOnInit() {
    this.changeDataFormat(this.data);
  }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.elem.nativeElement, 'width', '100%');
    // console.log('ngAfterViewInit:: isFixedOnTop: ', this.isFixedOnTop);
    this.fixedOnTop = (this.isFixedOnTop !== 'false');

    if (this.fixedOnTop) {
      // this.renderer.setElementStyle(this.elem.nativeElement, 'display', 'none');
      this.renderer.setElementStyle(this.elem.nativeElement, 'z-index', '9999');
      // this.renderer.setElementStyle(this.elem.nativeElement, 'position', 'fixed');
      // this.renderer.setElementStyle(this.elem.nativeElement, 'top', '43px');
    } else {
      this.dividerIndex = this.dividers.length;
      if (this.dividerIndex === 0) {
        this.renderer.setElementStyle(this.elem.nativeElement, 'display', 'none');
      }
      this.renderer.setElementStyle(this.elem.nativeElement, 'z-index', '9990');
      this.dividers.push({
        'fixed': (this.dividerIndex === 0) ? true : false,
        'offsetTop': this.elem.nativeElement.offsetTop,
        'year': this.date.year,
        'month': this.date.month
      });
      this.offsetTop = this.elem.nativeElement.offsetTop;
      console.log('this.dividerIndex: ', this.dividerIndex);
      console.log('(this.dividerIndex === 0) ? true : false: ', (this.dividerIndex === 0) ? true : false);
      console.log('this.dividers: ', this.dividers[this.dividers.length-1].fixed);
    }
  }


  ngOnChanges(changes) {

    if (this.fixedOnTop) {
      for(let i = this.dividers.length - 1; i > -1; i--) {
        let _data = this.dividers[i];
        console.log('_data.fixed:: ', _data.fixed); 
        if (_data.fixed) {
          console.log('_data:: ', _data);
          this.renderer.setElementStyle(this.elem.nativeElement, 'display', 'block');
          this.zone.run(() =>
            this.date = {
              year: _data.year,
              month: _data.month
            }
          );
          return;
        }
      }
    } else {
      this.changePosition(changes.scrollTop.previousValue, changes.scrollTop.currentValue);
    }
  }

  changeDataFormat(data) {
    if (!data || data === undefined) return; 
    this.date = this.dateService.formatString2Date(data.date, data.time);
  }
  
  changePosition(previousTop, currentTop = 0) {

    if (this.dividers.length === 0) return;
    let _isFixed = true;

    if (previousTop <= currentTop) {
      // 스크롤 내릴 때
      if (currentTop + 1 > this.offsetTop) {
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