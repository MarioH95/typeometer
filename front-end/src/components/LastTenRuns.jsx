import * as d3 from 'd3';
import React, { Component } from 'react';

const barContext = React.createContext('barChart');

class LastTenRuns extends Component {   
    constructor(props){
        super(props);
        this.state = {
            margin: {top: 30, right: 30, bottom: 70, left: 60},
            width: 800,
            height: 600,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stats.length === 0 && this.props.stats.length !== 0) {
            this.drawChart();
        } else if (this.props.stats.length !== 0 && prevProps.stats !== this.props.stats) {
            this.updateChart(prevProps.stats);
        }
    }

    drawChart() {
        barContext.drawn = true;
        barContext.count = 0;

        let data = [];
        let count = 0;
        for (const key in this.props.stats) {
            data.push({key: count, value: this.props.stats[key].wpm});
            count += 1;
        }

        const margin = this.state.margin;
        const height = this.state.height - margin.top - margin.bottom; 
        const width = this.state.width - margin.left - margin.right;
        const svg = d3.select(this.refs.svg)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
        .range([ 0, width ])
        .padding(0.2);
        var xAxis = svg.append("g")
        .attr("class", "xAaxis grid")
        .attr("ref", "xAaxis")
        .attr("transform", "translate(0," + height + ")");

        var y = d3.scaleLinear()
        .range([ height, 0]);
        var yAxis = svg.append("g")
        .attr("class", "yAxis grid")
        .attr("ref", "yAxis");
        
        x.domain(data.map(function(d) { return d.key; }));
        xAxis.call(d3.axisBottom(x).tickValues([]));

        y.domain([0, d3.max(data, function(d) { return d.value }) ]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y).tickSize(-width));

        var bars = svg.selectAll("rect")
        .data(data);

        bars
        .enter()
        .append("rect") 
        .merge(bars) 
        .transition() 
        .duration(1000)
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("y",  d => { return height; })
        .attr("height", 0)
            .transition()
            .duration(750)
            .delay(function (d, i) {
                return i * 100;
            })
        .attr("y",  d => { return y(d.value); })
        .attr("height",  d => { return height - y(d.value); })
        .attr("fill", "#69b3a2");      

        var key = function(d) {
            return d.key;
        };

        var texts = svg.selectAll('.barText')
					   .data(data, key)		
  
  		texts
        .enter()
        .append("text")
        .merge(texts)
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "white")
        .attr("class", "barText")
        .text(function(d){return d.value;})
        .transition() // and apply changes to all of them
        .duration(1000)
        .attr("x", function(d, i) {
                return x(i) + x.bandwidth() / 2;
        })
        .style("text-anchor", "middle")
        .attr("y",  d => { return height; })
        .attr("height", 0)
            .transition()
            .duration(750)
            .delay(function (d, i) {
                return i * 100;
            })
        .attr("y",  d => { return y(d.value) + 25; })
        .attr("height",  d => { return height - y(d.value); });

        barContext.svg = svg;
        barContext.xAxis = xAxis;
        barContext.yAxis = yAxis;

    }

    updateChart(stats) {
        // ---- remove the first element of array  
        let data = [];
        let count = barContext.count;
        for (const key in stats) {
            data.push({key: count, value: stats[key].wpm});
            count += 1;
        }

        data.shift();
        data.push({key: data[data.length - 1].key + 1, value: this.props.stats[this.props.stats.length - 1].wpm});

        let svg = barContext.svg;
        const margin = this.state.margin;
        const height = this.state.height - margin.top - margin.bottom; 
        const width = this.state.width - margin.left - margin.right;

        var key = function(d) {
            return d.key;
        };

        var x = d3.scaleBand()
        .range([ 0, width ])
        .padding(0.2);
        var y = d3.scaleLinear()
        .range([ height, 0]);

        
        var yAxis = barContext.yAxis;

        x.domain(d3.range(data.length));
        y.domain([0, d3.max(data, function(d) { return d.value }) ]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y).tickSize(-width));

        var bars = svg.selectAll("rect")
            .data(data, key);	
        
        bars.exit()
            .transition()
            .duration(500)
        .attr("width", 0) 
        .remove();

        bars
        .enter()
        .append('rect')
        .attr("x", width + margin.right)
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return height - y(d.value);
        })
        .attr("fill", "#69b3a2")
        .merge(bars)
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
            return x(i);
        })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })

        var texts = svg.selectAll('.barText')
            .data(data, key);

        texts.exit()
        .transition()
        .duration(500)
        .attr("width", 0) 
        .remove();

        texts
        .enter()
        .append("text")
        .attr("x", width + margin.right + x.bandwidth() / 2)
        .attr("y", function(d) {
            return y(d.value) + 25;
        })
        .attr("height", function(d) { return height - y(d.value); })
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "white")
        .attr("class", "barText")
        .merge(texts)
        .text(function(d){return d.value;})
        .style("text-anchor", "middle")
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
            return x(i) + x.bandwidth() / 2;
        })
        .attr("y", function(d) { return y(d.value) + 25; })
        .attr("height", function(d) { return height - y(d.value); })

        barContext.count = barContext.count + 1;
        barContext.svg = svg;
        barContext.yAxis = yAxis;
    }
        
    render(){
        return (
        <div ref='wpmBars'>
            <svg ref='svg'></svg>
        </div>
        )
    }
}

export default LastTenRuns;