import { Directive, ElementRef, Renderer, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { ZmLineChartVo as ChartVo} from './zm-line-chart-vo';
import _ from "lodash";

@Directive({
  selector: '[zm-line-chart]'   // [selector]: attr
})
export class ZmLineChart implements OnChanges{
  // @Input() width: string;
  @Input() bigSize: any;
  @Input() height: string;
  @Input() colX: string;
  @Input() colY: string;
  @Input() colXType: string;
  @Input() colYType: string;
  @Input() colXFormat: string;
  @Input() bindData: Array<ChartVo>;

  @Input() colXDomain;
  @Input() colYDomain;

  @Input() colXName;
  @Input() colYName;
  
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
    this.graphData = [];
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
    this.bigSize = (this.bigSize === 'true' || this.bigSize === true) || false;

    const _graphData = this.graphData;

    console.log('ZmLineChart:: drawGraph');

    const el:any = this.elem.nativeElement;
    const margin = {top: 20, right: 20, bottom: 30, left: 40};

    // 디렉티브 div
    const divW = el.offsetWidth;
    const divH = el.offsetHeight;

    // svg를 감싸고 있는 div
    const wrapW = divW;  
    const wrapH = divH;


    // chart 내 x축 y축 기준
    const chtW = divW - margin.left - ( this.bigSize ? 0 : margin.right );
    const chtH = divH - margin.top - margin.bottom;   

    const svgW = ( this.bigSize ? 30 * _graphData.length : divW );
    const svgH = divH - 10;
    // const axisW = divW - margin.left - margin.right;   // chart width

    for (let i = el.children.length - 1 ; i > -1; i--) {
      d3.select(el.children[i]).remove();
    }

    // draw chart start
    const div = d3.select(el);
    const svg_yaxis = div.append('svg')
      .attr('class', 'svg_yAxis')
      .attr('width', divW)
      .attr('height', svgH);

    const divWrap = div
      .append('div')
      .attr('class', 'chartWrapper')
      .style('width', wrapW + 'px')
      .style('height', wrapH + 'px');
    const svg = divWrap
      .append('svg')
      .attr('width', svgW)
      .attr('height', svgH);
    
    const g_yaxis = svg_yaxis.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let x = null;
    let y = d3.scaleLinear().rangeRound([chtH, 0]);

    if (this.colXType === 'date') {
      x = d3.scaleTime().rangeRound([0, this.bigSize ? (svgW - 80) : chtW]);
    } else {
      x = d3.scaleLinear().rangeRound([0, this.bigSize ? (svgW - 80) : chtW]);
    }

    const line = d3.line()
      .x( d => x(d['x']) )
      .y( d => y(d['y']) );

    const area = d3.area()
      .x( d => x(d['x']) )
      .y0( d => y(d['y']) )
      .y1( d => chtH );
    // -

    // make data
    let xDomain = null;
    let yDomain = null;

    if (this.colXDomain) {
      xDomain = this.colXDomain;
      yDomain = this.colYDomain;
    } else {
      xDomain = d3.extent(_graphData, d => d.x);
      yDomain = d3.extent(_graphData, d => d.y);

      yDomain = [yDomain[0] - 2, yDomain[1] + 0.5]
    }
    // -

    // x, y 축 범위 지정 
    x.domain(xDomain);
    y.domain(yDomain);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    g.append("g")
        .attr("transform", "translate(0," + chtH + ")")
        .call(xAxis)
        .attr('class', 'x axis')
        .append("text")
        .attr("fill", "#565A5B")
        .attr("transform", "rotate(0)")
        .attr("x", chtW - 4)
        .attr("y", -13)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(this.colXName || '');
        // .select(".domain")
        // .remove();

    g_yaxis.append("g")
        .call(yAxis)
        .attr('class', 'y axis')
        .append("text")
        .attr("fill", "#565A5B")
        .attr("transform", "rotate(-90)")
        .attr("x", -11)
        .attr("y", 15)
        .attr("dx", "0.71em")
        .attr("text-anchor", "end")
        .text(this.colYName || '');

    // x축 tick 설정 
    d3.selectAll("g.y.axis g.tick line")
      .attr('stroke', '#efefef')
      .attr('x1', 1)
      .attr("x2", function(d: number){
         if ( !(d % 1) ) return chtW;
      });

    d3.selectAll("g.x.axis g.tick line")
      .attr('stroke', (d: number) => {
        if(d === 0) {
          // x축 tick 중에 0번째는 다른색으로
          return '#000';
        }
        return '#efefef';
      })
      .attr('y1', chtH * -1)
      .attr("y2", (d: number) => {
         if ( !(d % 1) ) return 0;
      });


    // 그래프 영역
    // 그래프 데이터 면적 
    g.append("path")
        .datum(_graphData)
        .attr("fill", "#ffced0")
        .attr("opacity", "0.6")
        .attr("stroke", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", area);

    // 그래프 데이터 선 
    g.append("path")
        .datum(_graphData)
        .attr("fill", "none")
        .attr("opacity", "0.6")
        .attr("stroke", "#ff5a5f")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .append('text')
        .text((d) => d['label'] || '');


    this.drawing = false;
  }

  setComponentStyle() {
    let el:any = this.elem.nativeElement;
    // el.style.backgroundColor = 'yellow';
  }
}



