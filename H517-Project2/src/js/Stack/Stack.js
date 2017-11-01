let d3 = require('d3');
import './css.css'

class Stack{
	constructor(el){
		this.svg = d3.select(el);
		this.margin = {top: 60, right: 20, bottom: 60, left: 40};
		this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
		this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

		this.stackG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		this.svg.append('g')
			.append('text')
			.attr("x",(this.width + this.margin.left + this.margin.right)/2)
			.attr('y',30)
			.style('text-anchor','middle')
			.style('font-weight','bold')
			.text('The Amount of Import and Export for Top 25 Partners Per Year')

	}
	init(data, prop_x){
		this.data = data;

		this.x = d3.scaleBand()
			.rangeRound([0, this.width])
			.paddingInner(0.05)
			.align(0.1);

		this.y = d3.scaleLinear()
			.rangeRound([this.height, 0]);

		this.prop_x = prop_x;

		this.z = d3.scaleOrdinal()
			.range(["#22B14C", "#FF7F27", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
			// .range(["#998ec3", "#f1a340", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); 要改

		this.render();
	}
	render(){
		this.stackG.remove();
		this.stackG = this.svg.append('g').attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");;
		let  keys = Object.keys(this.data[0]).filter(k=>k!==this.prop_x);

		let data = this.data.map(d=>{
			let total = 0;
			keys.forEach(k=>{total+=d[k]});
			d.total = total;
			return d;
		});
		data = data.sort((a,b)=>b.total - a.total);

		this.x.domain(data.map(d=>d[this.prop_x]));
		this.y.domain([0, d3.max(data, function(d) { return d.total;})]).nice();
		this.z.domain(keys);

		this.stackG.append("g")
			.selectAll("g")
			.data(d3.stack().keys(keys)(data))
			.enter().append("g")
			.attr("fill", d => this.z(d.key))
			.selectAll("rect")
			.data(function(d) { return d; })
			.enter().append("rect")
			.attr("x", d => this.x(d.data[this.prop_x]))
			.attr("y", d => this.y(d[1]))
			.attr("height", d => this.y(d[0]) - this.y(d[1]))
			.attr("width", this.x.bandwidth());

		this.stackG.append("g")
			.attr("class", "axis x")
			.attr("transform", "translate(0," + this.height + ")")
			.call(d3.axisBottom(this.x));
		this.stackG.append('g')
			.append("text")
			.attr("x", this.width+this.margin.left - 20)
			.attr("y", this.y(this.y.ticks()[0]) - 10)
			.attr("fill", "#000")
			.style('font-size',10)
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Partner");

		this.stackG.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(this.y).ticks(null, "s"))
			.append("text")
			.attr("x", 2)
			.attr("y", this.y(this.y.ticks().pop()) - 10)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "end")
			.text("Dollar");

		var legend = this.stackG.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.attr("text-anchor", "end")
			.selectAll("g")
			.data(keys.slice().reverse())
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("x", this.width - 19)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", this.z);

		legend.append("text")
			.attr("x", this.width - 24)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function(d) { return d; });
	}
}
export {Stack}