import { Directive, ElementRef, Renderer, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { ZmLineChartVo as ChartVo} from './zm-line-chart-vo';
import _ from "lodash";

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
  
  drawing = false;
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
  }

  ngAfterViewInit() {
    // let el:any = this.elem.nativeElement;
    // console.log('ZmLineChart:: ngAfterViewInit: el.style.width: ', el.offsetWidth);
  }

  ngOnChanges(changes) {
    console.log(changes);
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

  drawGraph() {

    if (this.drawing) return;
    this.drawing = true;

    const _graphData = this.graphData;

    console.log('ZmLineChart:: drawGraph');

    const el:any = this.elem.nativeElement;
    const margin = {top: 10, right: 10, bottom: 30, left: 40};

    const divW = el.offsetWidth;      // div width
    const divH = el.offsetHeight;      // div height

    const chtW = divW - margin.left - margin.right; // 20 * _graphData.length;
    const chtH = divH - margin.top - margin.bottom;   // chart height

    const svgW = divW;  // chtW + margin.left + margin.right;
    const svgH = divH;
    // const axisW = divW - margin.left - margin.right;   // chart width


    if (el.children.length) {
      d3.select(el.children[0]).remove();
    }

    // draw chart start
    const div = d3.select(el);

    const svg = div.append('svg').attr('width', svgW).attr('height', svgH);
    
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const x = d3.scaleTime().rangeRound([0, chtW]);
    const y = d3.scaleLinear().rangeRound([chtH, 0]);

    const line = d3.line()
      .x( d => x(d['x']) )
      .y( d => y(d['y']) );

    const area = d3.area()
      .x( d => x(d['x']) )
      .y0( d => y(d['y']) )
      .y1( d => chtH );
    // -

    // make data
    const xDomain = d3.extent(_graphData, d => d.x);
    const yDomain = d3.extent(_graphData, d => d.y);
    // -

    const xAxis = d3.axisBottom(x);//.tickArguments([d3.timeDate.every(15)]);

    // x, y 축 범위 지정 
    x.domain(xDomain);
    y.domain([yDomain[0] - 4, yDomain[1] + 1]);

    g.append("path")
        .datum(_graphData)
        .attr("fill", "#ffced0")
        .attr("opacity", "0.6")
        .attr("stroke", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", area);

    g.append("path")
        .datum(_graphData)
        .attr("fill", "none")
        .attr("opacity", "0.6")
        .attr("stroke", "#ff5a5f")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    g.append("g")
        .attr("transform", "translate(0," + chtH + ")")
        .call(xAxis);
        // .select(".domain")
        // .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#565A5B")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Weight (kg)");

    this.drawing = false;
  }

  setComponentStyle() {
    let el:any = this.elem.nativeElement;
    // el.style.backgroundColor = 'yellow';
  }
}



