"use strict";
//init
const webpack = require("webpack");

//File ops
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

//Folder ops
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

//Constants
//const moduleName = "redux";
const SRC = path.join(__dirname,'src/');
const BUILD = path.join(__dirname,'dist');
//const TEMPLATES = path.join(__dirname,'src/'+moduleName);
const PUBLIC = path.join(SRC, 'public/');

const HOST = 'localhost';
const PORT = 8084;
//const PROXY = `http://${HOST}:${PORT}`;

module.exports={
    cache: true,
    // Source maps used for debugging information
    devtool:'source-map',
    //devtool:'eval',
    // webpack-dev-server configuration
    devServer:{
        contentBase:BUILD,
        //historyApiFallback:true,
        hot:true,
        host:HOST,
        port:PORT,
        publicPath: '/',
        watchOptions: {
            poll: true
        }
    },
    entry: [
	    /*'babel-polyfill',
	    'react-hot-loader/patch',*/
        SRC+"js/index.js"
    ],
    output:{
        path:BUILD,
        filename:'js/[name].js',
	    publicPath:"/"
    },
    module:{
        noParse: /node_modules\/json-schema\/lib\/validate\.js/,
	    rules: [
		    {
			    test:/\.(js|es6)$/,
			    "exclude": [
				    "node_modules"
			    ],
			    include: [path.join(__dirname, "src")],
			    use: ['react-hot-loader/webpack','babel-loader']/**/
		    },
		    {
			    test: /\.css$/,
			    use:ExtractTextWebpackPlugin.extract({
				    use: "css-loader"//!sass-loader
			    })
		    },
		    {
			    test: /\.(png|jpg|gif)$/,
			    use: [
				    {
					    loader: 'url-loader',
					    options: {
						    limit: 8192
					    }
				    }
			    ]
		    }
        ]
    },
    plugins:[
	    new CleanWebpackPlugin([BUILD]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') // eslint-disable-line quote-props
            }
        }),
        new webpack.DllReferencePlugin({
            context:__dirname,
            manifest:require('./bundle-manifest.json')
        }),

        new ExtractTextWebpackPlugin('css/styles.css'),
        //前端构建项目中，为了提高打包效率，往往将第三库与业务逻辑代码分开打包，因为第三方库往往不需要经常打包更新。
        // webpack建议使用CommonsChunk 来单独打包第三方库.
        //CommonsChunk虽然可以减少包的大小，但存在问题是：即使代码不更新，每次重新打包，vendor都会重新生成，不符合我们分离第三方包的初衷。
        /*new webpack.optimize.CommonsChunkPlugin({
            names:["common",
                "manifest"]
        }),*/
        new CopyWebpackPlugin([
                { from: PUBLIC, to: BUILD }
            ]
        ),
        new HtmlWebpackPlugin({
	        title: 'Hot Module Replacement',
            template: SRC+"index.html",
            filename: "index.html",
            inject: true,
            hash:false/*,
            chunks:['main',"common","manifest"]*/
        }),

	    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
	    new webpack.NamedModulesPlugin(),
	    // 开启全局的模块热替换(HMR)
	    new webpack.HotModuleReplacementPlugin(),

        /*new HtmlWebpackPlugin({
            title:"tree",
            template: TEMPLATES+"/tree.html",
            filename: "tree.html",
            inject: true,
            hash:false,
            chunks:['tree',"common","manifest"]
        }),*/
        new webpack.BannerPlugin('This file is created by gissky')
    ]
};