import './css.css';
import React,{Component} from 'react';
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import {Map} from 'immutable';
import PropTypes from 'prop-types';

//@immutableRenderDecorator
class Tooltip extends Component{
	static propTypes = {
		theme: PropTypes.string,
		style: PropTypes.object,
		title: PropTypes.any,
		content: PropTypes.any
	};

	constructor(props){
		super(props);
		let {theme, style, title, content} = this.props;
		this.state = {data: Map({theme, title, content}), style: Map({style})};
	}
	/*shouldComponentUpdate(nextProps,nextState){
		//this.state
		console.log(nextState.style.get("style"));
		this.state = nextState;
		return true;
	}*/

	render(){
		let data = this.state.data;
		let style = this.state.style;
		return (
			<div className={"tooltip " + (data.get('theme')? data.get('theme'): "black")}
		            style={style.get("style")? style.get("style"): {}}>
				<div>
					{data.get('title')}
					<hr/>
				</div>
				<div>
					{data.get('content')}
				</div>
			</div>
		);
	}
}

export {Tooltip}