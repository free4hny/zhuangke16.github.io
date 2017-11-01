import React,{Component} from 'react';
let d3 = require('d3');
class Bar2{
	constructor(el){
		this.svg = d3.select(el);
		this.margin = {top: 60, right: 20, bottom: 70, left: 40};
		this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
		this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

		this.barG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.svg.append('g')
			.append('text')
			.attr("x",(this.width + this.margin.left + this.margin.right)/2)
			.attr('y',30)
			.style('text-anchor','middle')
			.style('font-weight','bold')
			.text('Import and Export for Top 25 Partners Per Year')

	}
	init(data){
		this.data = data;
		this.x = d3.scaleBand()
			.rangeRound([0, this.width])
			.paddingInner(0.3)
			.align(0.1);

		this.y = d3.scaleLinear()
			.rangeRound([this.height, 0]);


		this.z = d3.interpolateRainbow;

		this.render();
	}
	render(){
		let color=['#998ec3','#f1a340'];
		this.barG.remove();
		this.barG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		let data = this.data;

		let keys = data.map(d=>d['countryd']);

		this.x.domain(keys);
		this.y.domain([0,d3.max(data, function(d) { return d3.max([d.import, d.export])})]);

		//this.z.domain(keys);

		let bar = this.barG.selectAll(".bar").data(data);
		bar.enter().append('g')
			.merge(bar)
			.attr('class','bar')
			.selectAll('rect').data(d=>[{countryd:d.countryd, num:d.import}, {countryd:d.countryd,num:d.export}])
			.enter().append('rect')
			.attr("x", (d,i) => this.x(d['countryd'])+ (this.x.bandwidth()/2 + 1)*i)
			.attr("y", d => this.y(0) - this.y(d['num']))
			.attr("height", d => this.y(d['num']))
			.attr("width", this.x.bandwidth()/2)
			.style('fill', (d,i)=>color[i]);

		bar.exit().remove();


		this.barG.append("g")
			.attr("class", "axis x")
			.attr("transform", "translate(0," + this.height + ")")
			.call(d3.axisBottom(this.x));

		this.barG.append('g')
			.append("text")
			.attr("x", this.width+this.margin.left - 20)
			.attr("y", this.y(this.y.ticks()[0]) - 10)
			.attr("fill", "#000")
			.style('font-size',10)
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Partner");

		this.barG.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(this.y).ticks(null, "s"))
			.append("text")
			.attr("x", 2)
			.attr("y", this.y(this.y.ticks().pop()) - 17)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Dollar");
	}
}

export {Bar2}