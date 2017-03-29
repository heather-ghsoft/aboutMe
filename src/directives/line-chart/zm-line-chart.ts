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
  @Input() colXType: string;  //date, string
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

  margin:any = {top: 20, right: 20, bottom: 30, left: 40};
  
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
    if (this.colXType === 'timeString') {
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
  
    const margin = this.margin;

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
    
    // y축 및 가로 보조라인 그리드 영역
    const g_yaxis = svg_yaxis.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x축과 세로 보조라인 그리드 및 그래프 데이터 영역
    const g = svg.append("g")
      .attr('class', 'graph-area')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    let x = null;
    let y = d3.scaleLinear().rangeRound([chtH, 0]);

    if (this.colXType === 'date') {
      x = d3.scaleTime().rangeRound([0, this.bigSize ? (svgW - 80) : chtW]);
    } else {
      x = d3.scaleLinear().rangeRound([0, this.bigSize ? (svgW - 80) : chtW]);
    }

    // 그래프 라인 
    const line = d3.line()
      .x( d => x(d['x']) )
      .y( d => y(d['y']) );

    // 그래프 면적
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

    const xAxis = d3.axisBottom(x); //.tickFormat(d3.timeFormat("%Y-%m-%d"));
    const yAxis = d3.axisLeft(y);

    // x 축
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

    // y 축
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

    x.ticks(d3.timeMinute.every(300));

    // 축 공통 설정
    d3.selectAll("g.axis path")
      .attr('stroke', '#565A5B');

    // 축 tick 공통 설정 - 폰트 
    d3.selectAll("g.axis g.tick text")
      .attr('fill', '#565A5B')
      .style('font-size', '9pt');

    // 축 tick 공통 설정 - 보조라인   
    d3.selectAll("g.axis g.tick line")
      .attr('stroke', '#efefef');

    // y 축 보조라인 설정
    d3.selectAll("g.y.axis g.tick line")
      .attr('stroke', (d: number) => {

        if(d % 5 === 0) {
          // x축 tick 중에 0번째는 다른색으로
          return '#ddd';
        }
        return '#efefef';
      })
      .attr('x1', 1)
      .attr("x2", function(d: number){
         if ( !(d % 1) ) return chtW;
      });

    // x 축 보조라인 설정
    d3.selectAll("g.x.axis g.tick line")
      .attr('stroke', (d) => {

        if (this.colXType === 'date') {
          const _d = new Date(d.toString());
          if(_d.getHours() % 6 === 0) {
            // x축 tick 중에 0번째는 다른색으로
            return '#ddd';
          }
        }
        return '#efefef';
      })
      .attr('y1', chtH * -1)
      .attr("y2", (d: number) => {
         if ( !(d % 1) ) return 0;
      });

    // 그래프 영역
    // 그래프 데이터 면적 
    // g.append("path")
    //     .datum(_graphData)
    //     .attr("fill", "#ffced0")
    //     .attr("stroke", "none")
    //     .attr("opacity", "0.6")
    //     .attr("d", area);

    // 그래프 데이터 선 
    // g.append("path")
    //     .attr('class', 'graph-line')
    //     .datum(_graphData)
    //     .attr("fill", "none")
    //     .attr("stroke", "#ff5a5f")
    //     .attr("opacity", "0.6")
    //     .attr("stroke-width", 1.2)
    //     .attr("d", line)
    //     .append('text')
    //     .text((d) => d['label'] || '');

    // 그래프 라인 
    g.selectAll("dot")
        .data(_graphData)
    .enter().append("line")
        .attr('class', 'graph-line')
        .attr("fill", "white")
        .attr("stroke", "#ff5a5f")
        .attr("stroke-width", 1)
        .attr("opacity", "0.2")
        .attr('value', (d) => d['y'])
        .attr("x1", (d, i, lines) => {
          const _x = x(d['x']);
          if (i > 0) {
            d3.select(lines[i-1]).attr('x2', _x);
            if (i === _graphData.length-1) {
              d3.select(lines[i]).attr('x2', _x);
            }
          }
          return _x;
        })
        .attr("y1", chtH)
        .attr("y2", chtH);

    g.selectAll("dot")
        .data(_graphData)
    .enter().append("circle")
        .attr("r", 3)
        .attr("fill", "white")
        .attr("stroke", "#ff5a5f")
        .attr("stroke-width", 1)
        .attr("opacity", "0.2") 
        .attr("cx", function(d) { return x(d['x'])})
        .attr("cy", chtH);

    g.selectAll(".graph-line")
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr("opacity", "1") 
      .attr("y1", (d, i, lines) => y(d['y']) )
      .attr("y2", (d, i, lines) => {
        let _y = y(d['y']);
        if (i < lines.length - 1) {
          _y = y(Number(d3.select(lines[i+1]).attr('value')));
        };
        return _y;
      });

    g.selectAll("circle")
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr("opacity", "1") 
      .attr("transform", function(d) {
        return "translate(" + [0, -1 * ( chtH - y(d['y'])) ] + ")";
      });
      // .style("fill", "blue")
      // .style("stroke", "blue");



    this.drawing = false;
  }

  setComponentStyle() {
    let el:any = this.elem.nativeElement;
    // el.style.backgroundColor = 'yellow';
  }
}



