import { Directive, ElementRef, Renderer, Input } from '@angular/core';
import * as d3 from 'd3';
import { Weight } from '../../vo/weight';

@Directive({
  selector: '[zm-line-chart]'   // [selector]: attr
})
export class ZmLineChart {
  @Input() width: string;
  @Input() height: string;
  @Input() graphData: Array<number>;
  
  g: any;
  x: any;
  y: any;
  line: any;
  
  constructor(
    private elem: ElementRef
  ){
    this.initGraph();
  }

  ngOnInit() {
    this.setComponentStyle();
  }

  initGraph() {

    let el:any = this.elem.nativeElement;
    let div = d3.select(el);
    let svg = div.append('svg');
    
    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    let width = +svg.attr("width") - margin.left - margin.right;
    let height = +svg.attr("height") - margin.top - margin.bottom;
    this.g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    this.x = d3.scaleTime()
        .rangeRound([0, width]);

    this.y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // this.line = d3.line()
    //     .x( (d: Weight) => this.x(d.dateTime) )
    //     .y( (d: Weight) => this.y(d.value) );
  }

  drawGraph() {

  }

  setComponentStyle() {
    let el:any = this.elem.nativeElement;
    el.style.backgroundColor = 'yellow';
    // el.style.width = this.width;
    // el.style.height = this.height;
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