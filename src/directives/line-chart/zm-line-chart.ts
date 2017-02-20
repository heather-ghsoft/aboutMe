import { Directive, ElementRef, Renderer, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { ZmLineChartVo as ChartVo} from './zm-line-chart-vo';

@Directive({
  selector: '[zm-line-chart]'   // [selector]: attr
})
export class ZmLineChart implements OnChanges{
  // @Input() width: string;
  @Input() height: string;
  @Input() colX: string;
  @Input() colY: string;
  @Input() colXType: string;
  @Input() colYType: string;
  @Input() colXFormat: string;
  @Input() bindData: Array<ChartVo>;
  
  loaded = false;
  graphData = [];
  chWidth: number;
  chHeight: number;
  g: any;
  x: any;
  y: any;
  line: any;
  
  constructor(
    private elem: ElementRef
  ){
  }

  ngOnInit() {
    console.log('ZmLineChart:: ngOnInit');
    this.setComponentStyle();
    this.initGraph();
    this.getGraphData();
    this.drawGraph();
    this.loaded = true;
  }

  ngAfterViewInit() {
    // let el:any = this.elem.nativeElement;
    // console.log('ZmLineChart:: ngAfterViewInit: el.style.width: ', el.offsetWidth);
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (!this.loaded) return;
    this.getGraphData();
    this.drawGraph();
  }

  getGraphData() {
    this.bindData.forEach((item) => {
      this.graphData.push({
        x: this.getColXData(item[this.colX]),
        y: this.getColYData(item[this.colY])
      });
    });
    console.log('ZmLineChart:: getGraphData: ', this.graphData);
  }

  getColXData(x) {

    var parseTime = d3.timeParse(this.colXFormat);
    if (this.colXType === 'date') {
      return parseTime(x);
    } else {
      return x;
    }
  }

  getColYData(y) {
    return Number(y);
  }

  initGraph() {

    let el:any = this.elem.nativeElement;
    let margin = {top: 0, right: 0, bottom: 30, left: 30};
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    this.chWidth = width - margin.left - margin.right;
    this.chHeight = height - margin.top - margin.bottom;

    console.log('this.chWidth: ', width);
    console.log('this.chHeight: ', height);

    let div = d3.select(el);
    let svg = div.append('svg').attr('width', width).attr('height', height);
    
    this.g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.x = d3.scaleTime()
        .rangeRound([0, this.chWidth]);

    this.y = d3.scaleLinear()
        .rangeRound([this.chHeight, 0]);

    this.line = d3.line()
        .x( d => this.x(d['x']) )
        .y( d => this.y(d['y']) );
  }

  drawGraph() {
    this.x.domain(d3.extent(this.graphData, d => d.x));
    this.y.domain(d3.extent(this.graphData, d => d.y));

    this.g.append("g")
        .attr("transform", "translate(0," + this.chHeight + ")")
        .call(d3.axisBottom(this.x))
        // .select(".domain")
        // .remove();

    this.g.append("g")
        .call(d3.axisLeft(this.y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    this.g.append("path")
        .datum(this.graphData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", this.line);
  }

  setComponentStyle() {
    let el:any = this.elem.nativeElement;
    // console.log('ZmLineChart:: setComponentStyle: height: ', this.height);
    el.style.backgroundColor = 'yellow';
    // el.style.width = '100%';
    // el.style.height = this.height + 'px';
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