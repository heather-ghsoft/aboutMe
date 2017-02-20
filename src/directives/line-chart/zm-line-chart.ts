import {Component, Directive, ElementRef, Renderer, Input } from '@angular/core';
import * as d3 from 'd3';

@Directive({
  selector: 'zm-line-chart'
})
export class ZmLineChart {
  @Input() width: string;
  @Input() height: string;
  @Input() data: Array<number>;
  
  divs: any;
  
  constructor(
    private elem: ElementRef
  ){

    // var el:any    = this.elem.nativeElement;
    // el.nativeElement.style.backgroundColor = 'yellow';
    // el.nativeElement.style.width = this.width;
    // el.nativeElement.style.height = this.height;
    // var graph:any = d3.select(el);

    // this.divs = graph.
    //   append('div').
    //   attr({
    //     'class': 'chart'
    //   }).
    //   style({
    //     'width':  this.width  + 'px',
    //     'height': this.height + 'px',
    //   }).
    //   selectAll('div');
  }

  ngOnInit() {

    console.log('ZmLineChart:: width:', this.width);
    console.log('ZmLineChart:: height:', this.height);
    
    let el:any    = this.elem.nativeElement;
    
    el.style.backgroundColor = 'yellow';
    el.width = this.width + 'px';
    el.height = this.height + 'px';
  }

  // render(newValue) {
  //   if (!newValue) return;

  //   this.divs.data(newValue).enter().append('div')
  //     .transition().ease('elastic')
  //     .style('width', d => d + '%')
  //     .text(d => d + '%');

  // }

  // onChange() {
  //   this.render(this.data);
  // }
}