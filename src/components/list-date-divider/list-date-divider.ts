import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { Content } from 'ionic-angular';
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
  @Input() scrollTop;
  @Input() dividers;

  dividerIndex = 0;
  offsetTop = 0;
  date;
  
  track($event) {
      // console.debug("Scroll Event", $event);
  }

  constructor(
    private dateService: DateService,
    private elem: ElementRef,
    public renderer: Renderer
  ) {
  }

  ngOnInit() {
    // console.log('ListDateDivider:: ngOnInit: this.data: ', this.data);
    this.changeDataFormat(this.data);
  }


  ngAfterViewInit() {

    this.renderer.setElementStyle(this.elem.nativeElement, 'width', '100%');
    this.dividerIndex = this.dividers.length - 1;
    this.renderer.setElementStyle(this.elem.nativeElement, 'z-index', 9999 + this.dividerIndex + '' );
    this.dividers.push = {
      'fixed': false,
      'offsetTop': this.elem.nativeElement.offsetTop
    };
    this.offsetTop = this.elem.nativeElement.offsetTop;
  }


  ngOnChanges(changes) {
    this.changePosition(changes.scrollTop.previousValue, changes.scrollTop.currentValue);
  }

  changeDataFormat(data) {

    if (!data) return; 
    this.date = this.dateService.formatString2Date(data.date, data.time);
  }
  
  changePosition(previousTop, currentTop) {
    
    if (currentTop === undefined) return;

    let isPlus = false;

    if (previousTop <= currentTop) isPlus = true;

    if (isPlus) {
      if (currentTop + 48 > this.offsetTop) {
        this.renderer.setElementStyle(this.elem.nativeElement, 'position', 'fixed');
        this.renderer.setElementStyle(this.elem.nativeElement, 'top', '44px');
      }
    } else {
      console.log('currentTop: ', currentTop, ', this.offsetTop :', this.offsetTop);
      if (currentTop < this.offsetTop + 10) {
        this.renderer.setElementStyle(this.elem.nativeElement, 'position', 'relative');
        this.renderer.setElementStyle(this.elem.nativeElement, 'top', '0px');
      }
    }
  }

  moveScroll() {
    // const el:any = this.elem.nativeElement;
    //this.divider.push();
  }
}