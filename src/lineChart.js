import * as d3 from 'd3';
import { DURATION } from './constants';
export const realTimeLineChart = () => {
  let margin = {top: 30, right: 10, bottom: 30, left: 25};
  let width = 1200;
  let height = 400;
  let color = d3.schemeCategory10;
  
  const drawChart = (selection)=> { 
    selection.each(function(data) {
      const t = d3.transition().duration(duration).ease(d3.easeLinear),
          x = d3.scaleTime().rangeRound([0, width-margin.left-margin.right]),
          y = d3.scaleLinear().rangeRound([height-margin.top-margin.bottom, 0]),
          z = d3.scaleOrdinal(color);
      const xMin = d3.min(data, function(c) { return d3.min(c.values, function(d) { return d.time; })});
      const xMax = new Date(new Date(d3.max(data, function(c) {
        return d3.max(c.values, function(d) { return d.time; })
      })).getTime() - (DURATION*2));
       
      x.domain([xMin, xMax]);
      y.domain([ 0, 400 ]); // static min and max
      z.domain(data.map(function(c) { return c.label; }));

      const line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.value); });

      let svg = d3.select('#chart').selectAll("svg").data([data]);
      const gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "axis x");
      gEnter.append("g").attr("class", "axis y");
      gEnter.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width-margin.left-margin.right)
          .attr("height", height-margin.top-margin.bottom);
      gEnter.append("g")
          .attr("class", "lines")
          .attr("clip-path", "url(#clip)")
        .selectAll(".data").data(data).enter()
          .append("path")
            .attr("class", "data");

      const legendEnter = gEnter.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width-margin.right-margin.left-90) + ",5)");
      legendEnter.append("rect")
        .attr("width", 80)
        .attr("height",50)
        .attr("fill", "#ffffff")
        .attr("fill-opacity", 0.9);
      legendEnter.selectAll("text")
        .data(data).enter()
        .append("text")
          .attr("y", function(d, i) { return (i*20); })
          .attr("x", 5)
          .attr("fill", function(d) { return z(d.label); })

 
      svg = selection.select("svg");
      svg.attr('width', width).attr('height', height);
      const g = svg.select("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.select("g.axis.x")
        .attr("transform", `translate(0,${height - margin.bottom - margin.top})`)
        .transition(t)
        .call(d3.axisBottom(x).ticks(5));
      g.select("g.axis.y")
        .transition(t)
        .attr("class", "axis y")
        .call(d3.axisLeft(y));

      g.select("defs clipPath rect")
        .transition(t)
        .attr("width", width-margin.left-margin.right)
        .attr("height", height-margin.top-margin.right);

      g.selectAll("g path.data")
        .data(data)
        .style("stroke", function(d) { return z(d.label); })
        .style("stroke-width", 1)
        .style("fill", "none")
        .transition()
        .duration(DURATION)
        .ease(d3.easeLinear)
        .on("start", tick);
      g.selectAll("g .legend text")
        .data(data)
        .text(function(d) {
          return `${d.label.toUpperCase()}: ${d.values[d.values.length-1].value}`;
        });

      function tick() {
        d3.select(this)
          .attr("d", function(d) { 
            console.log('linechart values', d.values)
            return line(d.values); 
          })
          .attr("transform", null);

        const xMinLess = new Date(new Date(xMin).getTime() - DURATION);
        d3.active(this)
            .attr("transform", `translate(${x(xMinLess)},0)`)
          .transition()
            .on("start", tick);
      }
    });
  }
  
  let duration = DURATION;
  drawChart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return drawChart;
  };

  drawChart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return drawChart;
  };

  drawChart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return drawChart;
  };

  drawChart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return drawChart;
  };

  drawChart.duration = function(_) {
    if (!arguments.length) return duration;
    duration = _;
    return drawChart;
  };

  return drawChart;
}


