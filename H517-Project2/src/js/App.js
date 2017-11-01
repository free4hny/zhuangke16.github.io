import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import {Map} from 'immutable'
let d3 = require("d3");
// import '../css/css.css';

@immutableRenderDecorator
class App extends Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		let el = ReactDOM.findDOMNode(this.refs.svg);
		console.log(el);
	}
	render(){
        return <svg ref="svg"></svg>
    }
}
export default App;