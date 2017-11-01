
"use strict";
//init
const webpack = require("webpack");


//File ops
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

//Folder ops
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

//Constants
const SRC = path.join(__dirname,'src/');
const BUILD = path.join(__dirname,'dist');
const PUBLIC = path.join(SRC, 'public/');


module.exports={
    entry: {
        main:SRC+"/js/index.js"
    },
    output:{
        path:BUILD,
       // publicPath: 'http://localhost:8080',
        filename:'js/[name].js'
    },
    resolve:{
        extensions: ['.js', '.jsx', '.scss', '.css']
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
			    use: ['react-hot-loader/webpack','babel-loader']
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
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') // eslint-disable-line quote-props
            }
        }),
        new ExtractTextWebpackPlugin('css/styles.css'),
        /*new webpack.optimize.CommonsChunkPlugin({
            names:["manifest"]
        }),*/
	    new webpack.DllReferencePlugin({
		    context:__dirname,
		    manifest:require('./bundle-manifest.json')
	    }),
        new CopyWebpackPlugin([
                { from: PUBLIC, to: BUILD }
            ]
        ),
        new HtmlWebpackPlugin({
            title:"MapV",
            template: SRC+"index.html",
            filename: "index.html",
            inject: true,
            hash:false
            //chunks:['main',"common","manifest"]
        }),
        new webpack.BannerPlugin('This file is created by gissky')
    ]
};