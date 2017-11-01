let d3 = require('d3');
import './css.css'

class Line{
	constructor(el){
		this.svg = d3.select(el);
		this.margin = {top: 60, right: 20, bottom: 30, left: 40};
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
			.text('Trend of Import and Export for Years')

	}
	init(data){
		this.data = data;
		this.x = d3.scaleLinear()
			.domain([2013,2016]).range([0, this.width]);


		this.y = d3.scaleLinear()
			.rangeRound([this.height, 0]);

		this.render();

		this.legend.remove();
		this.legend = this.svg.append('g');
		this.legend.append('rect')
			.attr('x',this.width+20)
			.attr('y',20)
			.attr('width',19)
			.attr('height',19)
			.attr('flag','i')
			.style('fill','#998ec3');
		this.legend.append('text')
			.attr('x',this.width+15)
			.attr('y',30)

			.style('text-anchor','end')
			.style('font-size','10px')
			.text('Import');

		this.legend.append('rect')
			.attr('x',this.width+20)
			.attr('y',45)
			.attr('width',19)
			.attr('height',19)
			.style('fill','#f1a340');

		this.legend.append('text')
			.attr('x',this.width+15)
			.attr('y',55)

			.style('stroke-width',2)
			.style('text-anchor','end')
			.style('font-size','10px')
			.text('Export');
	}
	render() {
		this.barG.remove();
		this.barG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		let data = this.data;

		this.y.domain([0, d3.max([
			+data.row_i.val2013,
			+data.row_i.val2014,
			+data.row_i.val2015,
			+data.row_i.val2016,
			+data.row_e.val2013,
			+data.row_e.val2014,
			+data.row_e.val2015,
			+data.row_e.val2016
		])]);

		data = {
			i:[{time:2013,import:+data.row_i.val2013},{time:2014,import:+data.row_i.val2014},
				{time:2015,import:+data.row_i.val2015},{time:2016,import:+data.row_i.val2016}],
			e:[{time:2013,export:+data.row_e.val2013},{time:2014,export:+data.row_e.val2014},
				{time:2015,export:+data.row_e.val2015},{time:2016,export:+data.row_e.val2016}]
		};

		let line = d3.line().x(d=>this.x(d.time)).y(d=>this.y(d.import)).curve(d3.curveNatural);
		this.barG.append('path')
				.attr('d',line(data.i))
			.attr('class','line_i');


		let line2 = d3.line().x(d=>this.x(d.time)).y(d=>this.y(d.export)).curve(d3.curveNatural);
		this.barG.append('path')
			.attr('d',line2(data.e))
			.attr('class','line_e');

		this.barG.append("g")
			.attr("class", "axis x")
			.attr("transform", "translate(0," + this.height + ")")
			.call(d3.axisBottom(this.x).ticks(4));

		this.barG.append('g')
			.append("text")
			.attr("x", this.width+this.margin.left - 20)
			.attr("y", this.y(this.y.ticks()[0]) - 10)
			.attr("fill", "#000")
			.style('font-size',10)
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Year");

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
export {Line}