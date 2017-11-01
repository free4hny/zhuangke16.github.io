import React,{Component} from 'react';
let d3 = require('d3');
class Bar{
	constructor(el){
		this.svg = d3.select(el);
		this.margin = {top: 60, right: 20, bottom: 30, left: 100};
		this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
		this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

		this.barG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		this.legend = this.svg.append('g');

		this.svg.append('g')
			.append('text')
			.attr("x",(this.width + this.margin.left + this.margin.right)/2)
			.attr('y',30)
			.style('text-anchor','middle')
			.style('font-weight','bold')
			.text('Import/Export Value for States Per Year')



	}
	init(data){
		this.data = data;


		this.y = d3.scaleBand()
			.rangeRound([this.height, 0])
			.paddingInner(0.5)
			.align(1);

		this.x_i = d3.scaleLinear()
			.rangeRound([0, this.width]);
		this.x_e = d3.scaleLinear()
			.rangeRound([0, this.width]);




		this.render();


		this.legend.remove();
		this.legend = this.svg.append('g');
		this.legend.append('rect')
			.attr('x',this.width+80)
			.attr('y',20)
			.attr('width',19)
			.attr('height',19)
			.attr('flag','i')
			.style('fill','#22B14C')
			.on('click',()=>{
				this.render();
			});
		this.legend.append('text')
			.attr('x',this.width+75)
			.attr('y',30)

			.style('text-anchor','end')
			.style('font-size','10px')
			.text('Import');

		this.legend.append('rect')
			.attr('x',this.width+80)
			.attr('y',45)
			.attr('width',19)
			.attr('height',19)
			.style('fill','#FF7F27')
			.on('click',()=>{
				this.renderExport();
			});

		this.legend.append('text')
			.attr('x',this.width+75)
			.attr('y',55)

			.style('stroke-width',2)
			.style('text-anchor','end')
			.style('font-size','10px')
			.text('Export');
	}
	render(){
		this.barG.remove();
		this.barG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		let data = this.data;

		console.log(data.map(d=>d['countryd']));
		this.y.domain(data.map(d=>d['countryd']));
		this.x_i.domain([0,d3.max(data, function(d) { return d.import;})]);
		this.x_e.domain([0,d3.max(data, function(d) { return d.export;})]);


		let bar_i = this.barG.selectAll(".i").data(data);
		bar_i.enter().append('rect')
			.merge(bar_i)
			.attr('class','i')
			.attr("x", 0)
			.attr("y", d => this.y(d['countryd']))
			.attr("height", this.y.bandwidth())
			.attr("width", d => this.x_i(d['import']))
			.style('fill','#22B14C');
			//.style('fill','#998ec3'); 要改
		bar_i.exit().remove();



		this.barG.append("g")
			.attr("class", "axis x")
			.attr("transform", "translate(0," + this.height + ")")
			.call(d3.axisBottom(this.x_i));

		this.barG.append('g')
			.append("text")
			.attr("x", this.width+5)
			.attr("y", this.height-5)
			.attr("fill", "#000")
			.style('font-size',10)
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Dollar");

		this.barG.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(this.y).ticks(null, "s"))
			.append("text")
			.attr("x", 30)
			.attr("y", 17)
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("State");
	}
	renderExport(){
		this.barG.remove();
		this.barG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		let data = this.data;

		this.y.domain(data.map(d=>d['countryd']));
		this.x_e.domain([0,d3.max(data, function(d) { return d.export;})]);


		let bar_e = this.barG.selectAll(".e").data(data);
		bar_e.enter().append('rect')
			.merge(bar_e)
			.attr('class','e')
			.attr("x", 0)
			.attr("y", d => this.y(d['countryd']))
			.attr("height", this.y.bandwidth())
			.attr("width", d => this.x_e(d['export']))
			.style('fill','#ff8c00');
			//.style('fill','#f1a340'); 要改
		bar_e.exit().remove();

		this.barG.append("g")
			.attr("class", "axis x")
			.attr("transform", "translate(0," + this.height + ")")
			.call(d3.axisBottom(this.x_i));

		/*this.barG.append('g')
			.append("text")
			.attr("x", this.width+this.margin.left - 20)
			.attr("y", this.y(this.y.ticks()[0]) - 10)
			.attr("fill", "#000")
			.style('font-size',10)
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Dollar");*/
		this.barG.append('g')
			.append("text")
			.attr("x", this.width+5)
			.attr("y", this.height-5)
			.attr("fill", "#000")
			.style('font-size',10)
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Dollar");

		this.barG.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(this.y).ticks(null, "s"))
			.append("text")
			.attr("x", 30)
			.attr("y", 17)
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("State");
	}
}

export {Bar}