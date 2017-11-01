import React,{Component} from 'react';
import ReactDOM from 'react-dom'
import {Nav} from './Nav/Nav'
import {WorldMap} from './WorldMap'
import {Tooltip} from './Tooltip/Tooltip'
import {Stack} from './Stack/Stack'
import {Bar} from './Bar/Bar'
import {Bar2} from './Bar/Bar2'
import {Line} from './Line/Line'
import {Map} from 'immutable'
let d3 = require('d3');

class App extends Component{
	constructor(props){
		super(props);
		this.worldMap = new WorldMap();
	}
	componentDidMount(){
		let el = ReactDOM.findDOMNode(this.refs.svg);
		let tooltip = this.refs['tooltip'];
		let barSvg = ReactDOM.findDOMNode(this.refs['bar_svg']);
		let barSvg2 = ReactDOM.findDOMNode(this.refs['bar_svg2']);
		let barSvg3 = ReactDOM.findDOMNode(this.refs['bar_svg3']);
		let line_svg = ReactDOM.findDOMNode(this.refs['line_svg']);
		this.worldMap.setCanvas(el);
		let stack = new Stack(barSvg);
		let bar  = new Bar(barSvg2);
		let bar3 = new Bar2(barSvg3);
		let line = new Line(line_svg);
		this.worldMap.setStack(stack,bar,bar3,line);
		d3.json('data/us-states.geo.json',(error,us)=>{
			this.worldMap.init(us, tooltip);
		});

		console.log(el);
	}
	render(){
		return (
			<div>
				<Tooltip ref="tooltip" theme={"black"} style={{left:"-1000px"}}/>
				<div id="cent" style={{width:'1400px', margin:'0 auto', position: 'relative', background:'#E8E6E6'}}>
					<Nav worldMap={this.worldMap}/>
					<div id="map" style={{overflow: 'hidden', width: '800px',
						height: '870px', position: 'absolute', top: '50px', background:'#E8E6E6'}}>
						<svg ref="svg" width={2500} height={1000}>
							<defs>
								<linearGradient id="orange_red" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{"stop-color":"#f9f9f9",stop_opacity:"1"}}/>
									<stop offset="100%" style={{"stop-color":"#2d004b", "stop-opacity":"1"}}/>
								</linearGradient>
								<linearGradient id="orange_red2" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{"stop-color":"#f9f9f9",stop_opacity:"1"}}/>
									<stop offset="100%" style={{"stop-color":"#7f3b08", "stop-opacity":"1"}}/>
								</linearGradient>
							</defs>
							<g id="map"/>
							<g id="i" style={{opacity:0}}>
								<rect x="600" y="800" width="180" height="15" style={{"fill":"url(#orange_red)"}}/>
								<text id='red_left' x="600" y="790" style={{"text-anchor":'start'}}>200</text>
								<text id='red_right' x="780" y="790" style={{"text-anchor":'end'}}>200</text>
							</g>
							<g id="e" style={{opacity:0}}>
								<rect x="600" y="800" width="180" height="15" style={{"fill":"url(#orange_red2)"}}/>
								<text id='blue_left' x="600" y="790" style={{"text-anchor":'start'}}>200</text>
								<text id='blue_right' x="780" y="790" style={{"text-anchor":'end'}}>200</text>
							</g>
							<g>
								<text x="400" y="50" style={{"text-anchor":'middle','font-weight':'bold'}}>US State Map</text>
							</g>

						</svg>
					</div>
					<div id="bar1" style={{position: 'absolute', left: '820px',  top:'50px', display: 'inline-block',background:'#E8E6E6'}}>
						<svg ref="bar_svg" width={530} height={300}/>
					</div>
					<div id="bar2"  style={{position: 'absolute', left: '820px',  top:'640px', display: 'inline-block',background:'#E8E6E6'}}>
						<svg ref="bar_svg2" width={530} height={650}/>
					</div>
					<div id="bar3" style={{position: 'absolute', left: '0px',  top:'940px', display: 'inline-block',background:'#E8E6E6'}}>
						<svg ref="bar_svg3" width={800} height={350}/>
					</div>
					<div id="line" style={{position: 'absolute', left: '820px',  top:'370px', display: 'inline-block',background:'#E8E6E6'}}>
						<svg ref="line_svg" width={530} height={250}/>
					</div>
				</div>
			</div>

		);
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);