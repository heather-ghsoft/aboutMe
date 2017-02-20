import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as d3 from 'd3'
import { DbService } from '../../services/firebase/firebase.db.service';

@Component({
  selector: 'page-weight-chart',
  templateUrl: 'weight-chart.html'
})

export class WeightChartPage {

  graphData;

  constructor(
    private navCtrl: NavController,
    private db: DbService
  ) {}

  ngOnInit() {

    this.db.getWeights((data) => { this.graphData = data });


    // var svg = d3.select("svg"),
    // margin = {top: 20, right: 20, bottom: 30, left: 50},
    // width = +svg.attr("width") - margin.left - margin.right,
    // height = +svg.attr("height") - margin.top - margin.bottom,
    // g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var parseTime = d3.timeParse("%d-%b-%y");

    // var x = d3.scaleTime()
    //     .rangeRound([0, width]);

    // var y = d3.scaleLinear()
    //     .rangeRound([height, 0]);

    // var line = d3.line()
    //     .x(function(d) { return x(d['date']); })
    //     .y(function(d) { return y(d['close']); });

    // d3.tsv("../../data.tsv", (tsvData) => {
    //   let d: d3Dsv.DSVRowString = tsvData;
    //   d.date = parseTime(d.date);
    //   d.close = +d.close;
    //   return d;
    // }, function(error, data) {
    //   if (error) throw error;

    //   x.domain(d3.extent(data, d => d.date ));
    //   y.domain(d3.extent(data, d => d.close ));

    //   g.append("g")
    //       .attr("transform", "translate(0," + height + ")")
    //       .call(d3.axisBottom(x))
    //     .select(".domain")
    //       .remove();

    //   g.append("g")
    //       .call(d3.axisLeft(y))
    //     .append("text")
    //       .attr("fill", "#000")
    //       .attr("transform", "rotate(-90)")
    //       .attr("y", 6)
    //       .attr("dy", "0.71em")
    //       .attr("text-anchor", "end")
    //       .text("Price ($)");

    //   g.append("path")
    //       .datum(data)
    //       .attr("fill", "none")
    //       .attr("stroke", "steelblue")
    //       .attr("stroke-linejoin", "round")
    //       .attr("stroke-linecap", "round")
    //       .attr("stroke-width", 1.5)
    //       .attr("d", line);
    // });
  }
}