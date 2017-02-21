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
  
  loaded = false;
  idDrawn = false;
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
    this.loaded = true;
  }

  ngAfterViewInit() {
    // let el:any = this.elem.nativeElement;
    // console.log('ZmLineChart:: ngAfterViewInit: el.style.width: ', el.offsetWidth);
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (this.loaded && !this.idDrawn) return;
    this.getGraphData();
    this.drawGraph();
    this.idDrawn = true;
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

    console.log('ZmLineChart:: drawGraph');

    const el:any = this.elem.nativeElement;
    const margin = {top: 10, right: 10, bottom: 30, left: 50};

    const divW = el.offsetWidth;      // div width
    const divH = el.offsetHeight;      // div height

    const chtW = divW - margin.left - margin.right;   // chart width
    const chtH = divH - margin.top - margin.bottom;   // chart height

    // draw chart start
    const div = d3.select(el);
    const svg = div.append('svg').attr('width', divW).attr('height', divH);
    
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const x = d3.scaleTime().rangeRound([0, chtW]);
    const y = d3.scaleLinear().rangeRound([chtH, 0]);

    const line = d3.line()
        .x( d => x(d['x']) )
        .y( d => y(d['y']) );
    // -

    // make data
    const _graphData = this.graphData;
    const xDomain = d3.extent(_graphData, d => d.x);
    const yDomain = d3.extent(_graphData, d => d.y);
    // -

    // const xAxis = d3.axisBottom.scale(x).tickSize(-chtH).tickSubdivide(true);

    // x, y 축 범위 지정 
    x.domain(xDomain);
    y.domain([yDomain[0] - 4, yDomain[1] + 1]);

    g.append("g")
        .attr("transform", "translate(0," + chtH + ")")
        .call(d3.axisBottom(x));
        // .select(".domain")
        // .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    g.append("path")
        .datum(_graphData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
  }

  setComponentStyle() {
    let el:any = this.elem.nativeElement;
    el.style.backgroundColor = 'yellow';
  }
}



