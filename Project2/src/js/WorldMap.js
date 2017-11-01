let d3 = require("d3");
let _ = require('d3-selection-multi');
let d3GeoProj = require('d3-geo-projection');
import {Map} from 'immutable';
import React from 'react';

let redColor = d3.scaleLinear().range(['#f9f9f9', '#2d004b']);
let blueColor = d3.scaleLinear().range(['#f9f9f9', '#7f3b08']);

let zoom;
let active = d3.select(null);
let svg;
function reset() {
	active.classed("active", false);
	active = d3.select(null);

	svg.transition()
		.duration(750)
		// .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
		.call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function update(mapG, busiData, us, extent, year, good, tooltip, other, fillLabel, county){

	let goodData, good_i_World, good_e_World, extent_i, extent_e, _data2, maxPater;
	if(county && county !=="none"){
		let _ddd = busiData.data_country;

		let _countyPs = [
			..._ddd.imctyall.filter(d=>d.countryd === county),
			..._ddd.exctyall.filter(d=>d.countryd === county)
		];
		_countyPs =_countyPs.sort((a,b)=>(+b['val'+year]) - (+a['val'+year]));
		maxPater = _countyPs[0].statename;
	}
	if(busiData){
		goodData = busiData.data_goods;
		good_i_World = goodData.imctyall.filter(g=>g['abbreviatn'] === 'World');
		good_e_World = goodData.exctyall.filter(g=>g['abbreviatn'] === 'World');
		extent_i = d3.extent(good_i_World, (g)=>g['val'+year]);
		extent_e = d3.extent(good_e_World, (g)=>g['val'+year]);
		redColor.domain(extent_i);
		blueColor.domain(extent_e);


		//创建每个州的进出口数据
		let data = busiData.data_country;
		data = {
			i:data.imctyall.filter(d=>d.countryd === 'World'),
			e:data.exctyall.filter(d=>d.countryd === 'World')
		};

		//{countryd: "Canada", import: 2877.02, export: 634.89, total: 3511.91}

		//{countryd: "Alabama", import: "22132.1", export: "20422.13"}
		_data2 = data.i.map(d=>{
			let obj = {};
			obj.countryd = d.statename;
			obj.import = +d['val'+year];
			obj.row_i = d;

			let e_o = data.e.find(e=>e.statename === d.statename) || {['val'+year]:0};

			obj.export = +e_o['val'+year];
			obj.row_e = e_o;
			return obj;
		});
		other.bar.init(_data2);

	}

	let _extent = [[0,0],[extent.width,extent.height]];
	let updateM = mapG.selectAll("path").data(us.features);
	let path = d3.geoPath(d3GeoProj.geoNaturalEarth()
		.fitExtent(_extent,us));
	updateM.enter().append('path')
		.merge(updateM)
		.attr("d",path)
		.on("mouseover",(evt)=>{
			if(county && county !=="none") return;
			let data= null;
			let key='countryd',
				value = 'World';
			if(good){
				data = busiData.data_goods;
				value = good;
				let data_country = busiData.data_goods;
				//let _evt = d3.select(evt);
				let usName = evt["properties"]['name'];
				let exportObj = data_country.exctyall.find(d=>d['statename'] === usName && d['good']===good);
				let toolTipData = {};
				if(exportObj){
					toolTipData.export=exportObj["val"+year];
				}
				let importObj = data_country.imctyall.find(d=>d['statename'] === usName);
				if(importObj){
					toolTipData.import = importObj["val"+year];
				}

				let coord = d3.mouse(document.getElementById('cent'));
				tooltip.setState(
					{
						data: Map({
							title:usName+"'s info",
							content:<div>
								<div>sum_import: {toolTipData.import}</div>
								<div>sum_export: {toolTipData.export}</div>
							</div>}),
						style: Map({style:{left:`${coord[0]+10}px`, top: `${coord[1]}px`}})
					});
			}else if(busiData.data_country){
				data = busiData.data_country;
				//let _evt = d3.select(evt);

				let usName = evt["properties"]['name'];
				let exportObj = data.exctyall.find(d=>d['statename'] === usName && d[key] === value);
				let toolTipData = {};
				if(exportObj){
					toolTipData.export=exportObj["val"+year];
				}
				let importObj = data.imctyall.find(d=>d['statename'] === usName && d[key] === value);
				if(importObj){
					toolTipData.import = importObj["val"+year];
				}

				let importObjTop2 = [data.imctyall.find(d=>d['statename'] === usName && d['rank']==1),
					data.imctyall.find(d=>d['statename'] === usName && d['rank']==2)];
				let exportObjTOp2 = [data.exctyall.find(d=>d['statename'] === usName && d['rank']==1),
					data.exctyall.find(d=>d['statename'] === usName && d['rank']==2)];

				let coord = d3.mouse(document.body);
				tooltip.setState(
					{
						data: Map({
							title:usName+"'s info",
							content:<div>
								<div>sum_import: {toolTipData.import}</div>
								<div>sum_export: {toolTipData.export}</div>
								<div>Top 2 Trading partner(import): {(importObjTop2.map(o=>o.countryd)).join("、")}</div>
								<div>Top 2 Trading partner(export): {(exportObjTOp2.map(o=>o.countryd)).join("、")}</div>
							</div>}),
						style: Map({style:{left:`${coord[0]+10}px`, top: `${coord[1]}px`}})
					});
			}
		})
		.on('mouseout',()=>{
			if(county && county !=="none") return;
			tooltip.setState(
				{
					style: Map({style:{left:`-1000px`}})
				})
		})
		.on('click',function(evt){
			console.log(evt);
			let usName = evt["properties"]['name'];
			let data = busiData.data_country;

			let importD = data.imctyall.filter(d=>d['statename'] ===usName).filter(d=>d['rank']>0);
			let exportD = data.exctyall.filter(d=>d['statename'] ===usName).filter(d=>d['rank']>0);

			let importAndExportOnTargetState = importD.map(i=>{
				let d = {};
				/*d.statename = i.statename;*/
				d.countryd = i.countryd;
				d.import = +i['val'+year];
				let exportOnTargetState = exportD.find(e=>e.countryd === i.countryd);
				d.export = exportOnTargetState? +exportOnTargetState['val'+year] : 0;
				return d;
			});

			other.stack.init(importAndExportOnTargetState,'countryd');
			//other.bar.init(importAndExportOnTargetState);
			other.bar3.init(importAndExportOnTargetState);

			let lineD = _data2.find(d=>d.countryd === usName);
			other.line.init(lineD);

			d3.selectAll('path').style('stroke','#000').style('stroke-width',1);
			d3.select(this).style('stroke','FFF200').style('stroke-width',2);
		})
		.style('stroke','#000')
		.style("fill",function(d){
			//let goodData = busiData ? busiData.data_goods:{};
			let usName = d["properties"]['name'];
			if(county && county!=="none"){
				if(usName===maxPater){
					let coord=path.centroid(d);

					console.log(coord);
					tooltip.setState(
						{
							data: Map({
								title:maxPater+"'s top trading partner",
								content:<div>{usName}</div>}),
							style: Map({style:{left:`${coord[0]+10}px`, top: `${coord[1]}px`}})
						});
					return '#d73027';
				}
				return '#4575b4';
			}
			if(fillLabel === "i" && !!good){
				let data = goodData.imctyall;
				let obj = data.find(s=>s['statename'] === usName && s['abbreviatn']==='World');
				return obj? redColor(obj["val"+year]) : '#f9f9f9';
			}else if(fillLabel === "e" && !!good){
				let data = goodData.exctyall;
				let obj = data.find(s=>s['statename'] === usName && s['abbreviatn']==='World');
				return obj? blueColor(obj["val"+year]) : '#f9f9f9';
			}else {
				return '#4575b4';
			}
		});

	if(fillLabel === "i" && !!good){
		d3.select('#i')
			.style('opacity',0);
		d3.select('#e')
			.style('opacity',0);

		d3.select('#i')
			.style('opacity',1);
		d3.select("#red_left").html(extent_i[0]);
		d3.select("#red_right").html(extent_i[1]);
	}else if(fillLabel === "e" && !!good){
		d3.select('#i')
			.style('opacity',0);
		d3.select('#e')
			.style('opacity',0);

		d3.select('#e')
			.style('opacity',1);
		d3.select("#blue_left").html(extent_e[0]);
		d3.select("#blue_right").html(extent_e[1]);
	}else {
		d3.select('#i')
			.style('opacity',0);
		d3.select('#e')
			.style('opacity',0);
	}

	updateM.exit().remove();
}

class WorldMap{
	constructor(){
		this.year = (new Date()).getFullYear();
	}
	updateYear(year){
		this.year = year;
		this.render();
	}
	updateTaregtGood(good){
		this.good = good;
		this.render();
	}
	setStack(stack, bar, bar3, line){
		this.stack = stack;
		this.bar = bar;
		this.bar3 = bar3;
		this.line = line;
	}
	setCanvas(el){
		svg = d3.select(el);
		//this.mapG = svg.append('g');
		this.mapG = svg.select('#map');

		zoom = d3.zoom()
			.scaleExtent([1, 8])
			.on("zoom", () =>{
				this.mapG.style("stroke-width", 1.5 / d3.event.transform.k + "px");
				this.mapG.attr("transform", d3.event.transform);
			});
		svg.call(zoom)
			.on("click", ()=>{if (d3.event.defaultPrevented) d3.event.stopPropagation();}, true);
		this.width = +svg.attr("width");
		this.height = + svg.attr("height");

		console.log(this.width);
	}
	init(us, tooltip){
		this.us = us;
		this.tooltip = tooltip;
		this.render();
	}
	setBusi_Data(data){
		this.Busi_Data = data;

		console.log('----------------------------------');
		console.log(data);
		this.render();

	}
	reset(){
		let {width, height} = this;
		update(this.mapG, this.Busi_Data,this.us,{width, height},2016,null, this.tooltip,
			{stack:this.stack,bar:this.bar, bar3: this.bar3, line:this.line});
	}
	renderByExport(){
		let {width, height} = this;
		update(this.mapG, this.Busi_Data,this.us,{width, height},this.year,this.good, this.tooltip,
			{stack:this.stack,bar:this.bar, bar3: this.bar3, line:this.line},"e");
	}
	renderByImport(){
		let {width, height} = this;
		update(this.mapG, this.Busi_Data,this.us,{width, height},this.year,this.good, this.tooltip,
			{stack:this.stack,bar:this.bar, bar3: this.bar3, line:this.line},"i");

		d3.select("#i")
			.style('opacity',1);
	}
	renderByCounty(county){
		let {width, height} = this;
		update(this.mapG, this.Busi_Data,this.us,{width, height},this.year,this.good, this.tooltip,
			{stack:this.stack,bar:this.bar, bar3: this.bar3, line:this.line},"i", county);
	}
	render(){
		let {width, height} = this;
		update(this.mapG, this.Busi_Data,this.us,{width, height},this.year,this.good, this.tooltip,
			{stack:this.stack,bar:this.bar, bar3: this.bar3, line:this.line});
	}
}
export {WorldMap}