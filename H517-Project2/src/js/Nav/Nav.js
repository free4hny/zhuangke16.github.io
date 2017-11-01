import React,{Component} from 'react';
let d3 = require('d3');
import './css.css';
import PropTypes from 'prop-types';
import {WorldMap} from "../WorldMap";

let year = [2013,2014,2015,2016];
let goods = [
	'Animal & Animal Products',
	'Vegetable Products',
	'Foodstuffs',
	'Mineral Products',
	'Chemicals & Allied Industries',
	'Plastics / Rubbers',
	'Raw Hides, Skins, Leather, & Furs',
	'Wood & Wood Products',
	'Textiles',
	'Footwear / Headgear',
	'Stone / Glass',
	'Metals',
	'Machinery / Electrical',
	'Transportation',
	'Miscellaneous'
];
let goodsObj = [
	{from:1,to:5,name:'Animal & Animal Products'},
	{from:6,to:15,name:'Vegetable Products'},
	{from:16,to:24,name:'Foodstuffs'},
	{from:25,to:27,name:'Mineral Products'},
	{from:28,to:38,name:'Chemicals & Allied Industries'},
	{from:39,to:40,name:'Plastics / Rubbers'},
	{from:41,to:43,name:'Raw Hides, Skins, Leather, & Furs'},
	{from:44,to:49,name:'Wood & Wood Products'},
	{from:50,to:63,name:'Textiles'},
	{from:64,to:67,name:'Footwear / Headgear'},
	{from:68,to:71,name:'Stone / Glass'},
	{from:72,to:83,name:'Metals'},
	{from:84,to:85,name:'Machinery / Electrical'},
	{from:86,to:89,name:'Transportation'},
	{from:90,to:97,name:'Miscellaneous'},
];

let county = [
	"none",
"Canada",
"China",
"Germany",
"Mexico",
"United Kingdom",
"Japan",
"Korea, South",
"United Arab Emirates",
"France",
"Australia",
"India",
"Belgium",
"Brazil",
"Taiwan",
"Saudi Arabia",
"South Africa",
"Colombia",
"Netherlands",
"Dominican Republic",
"Singapore",
"Hong Kong",
"Italy",
"Thailand",
"Honduras",
"Kuwait"];


function row(r) {
	let _r = {};
	_r.statename = r.statename;
	_r.rank = +r.rank;
	_r.id = +((""+r.hs6).substr(0,2));
	let g = goodsObj.find(g=>_r.id>=g.from && _r.id<=g.to);
	_r.good = g? g.name : "";
	_r.val2013 = +r.val2013;
	_r.val2014 = +r.val2014;
	_r.val2015 = +r.val2015;
	_r.val2016 = +r.val2016;
	_r.abbreviatn = r.abbreviatn;

	return _r;
}


let getData = async function (data) {
	data.data_country = await new Promise(resolve=>{
		let queue = d3.queue();
		queue.defer(d3.csv,'data/imctyall.csv')
			.defer(d3.csv,'data/exctyall.csv')
			.await(
				(error,imctyall,exctyall)=>{
					if(error) throw new Error(error);

					resolve({imctyall,exctyall});
				});
	});

	let data_goods = await new Promise(resolve=>{
		let queue = d3.queue();
		queue.defer(d3.csv,'data/imctyall_goods.csv', row)
			.defer(d3.csv,'data/exctyall_goods.csv', row)
			.await(
				(error,imctyall,exctyall)=>{
					if(error) throw new Error(error);

					resolve({imctyall,exctyall});
				});
	});

	let goods_nest_imctyall = d3.nest().key(d=>d.statename).key(d=>d.id).entries(data_goods.imctyall);
	let goods_nest_exctyall = d3.nest().key(d=>d.statename).key(d=>d.id).entries(data_goods.exctyall);

	let nest_imctyall = [];
	goods_nest_imctyall.forEach(nest=>{
		let o = nest.values;
		for(let i=0; i< o.length; i++){
			let obj = o[i];
			let _obj = obj.values[0];
			for (let j=1; j<obj.values.length; j++){
				_obj.val2013 += obj.values[j].val2013;
				_obj.val2014 += obj.values[j].val2014;
				_obj.val2015 += obj.values[j].val2015;
				_obj.val2016 += obj.values[j].val2016;
			}
			nest_imctyall.push(_obj);
		}

	});
	let nest_exctyall = [];
	goods_nest_exctyall.forEach(nest=>{
		let o = nest.values;
		for(let i=0; i< o.length; i++){
			let obj = o[i];
			let _obj = obj.values[0];
			for (let j=1; j<obj.values.length; j++){
				_obj.val2013 += obj.values[j].val2013;
				_obj.val2014 += obj.values[j].val2014;
				_obj.val2015 += obj.values[j].val2015;
				_obj.val2016 += obj.values[j].val2016;
			}
			nest_exctyall.push(_obj);
		}

	});

	data.data_goods={
		imctyall: nest_imctyall,
		exctyall: nest_exctyall
	};

	console.log(data.data_goods);
};
class Nav extends Component{
	static PropTypes={
		worldMap: PropTypes.instanceOf(WorldMap)
	};
	constructor(props){
		super(props);
		this.data = {};
		getData(this.data).then(()=>{
			this.props.worldMap.updateYear(2016);
			this.props.worldMap.setBusi_Data(this.data);

		});
	}
	handleYearClick(evt){
		let targetDom = evt.currentTarget;
		let year = +d3.select(targetDom).attr('id');
		this.props.worldMap.updateYear(year);
	}
	handleGoodClick(evt){
		let targetDom = evt.currentTarget;
		let good = d3.select(targetDom).attr('id');
		this.props.worldMap.updateTaregtGood(good);
	}
	handleImportClick(){
		this.props.worldMap.renderByImport();
	}
	handleResetClick(){
		this.props.worldMap.reset();
	}
	handleExportClick(){
		this.props.worldMap.renderByExport();
	}
	handleCounty(evt){
		console.log();
		let ne = evt.nativeEvent;
		let target = ne.target.id;
		this.props.worldMap.renderByCounty(target);
	}
	render(){

		return <div style={{position: 'absolute', zIndex:10, top:'-24px'}}>
			<ul className="nav">
				<li><a href="#"> </a></li>
				<li className="drop-down"><a href="#">Year</a>
					<ul className="drop-down-content">
						{year.map(y=>{
							return <li id={y} onClick={this :: this.handleYearClick}><a href="#">{y}</a></li>
						})}
					</ul>
				</li>
				<li className="drop-down"><a href="#">commodities</a>
					<ul className="drop-down-content">
						{goods.map(g=><li id={g} onClick={this :: this.handleGoodClick}><a href="#">{g}</a></li>)}
					</ul>
				</li>
				<li className="drop-down"><a href="#">countries</a>
					<ul className="drop-down-content">
						{county.map(g=><li id={g} onClick={this :: this.handleCounty}><a href="#" id={g}>{g}</a></li>)}
					</ul>
				</li>
				<li onClick={this:: this.handleResetClick}><a href="#">Reset</a></li>
				<li onClick={this:: this.handleImportClick}><a href="#">Import</a></li>
				<li onClick={this:: this.handleExportClick}><a href="#">Export</a></li>
			</ul>
		</div>
	}
}
export {Nav}