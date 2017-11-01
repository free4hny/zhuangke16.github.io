const webpack = require("webpack");
const path = require("path");
const dll = path.join(__dirname,"src/public/dll");

const vendors = [
	"d3",
    "d3-selection-multi",
	'classnames',
    'react',
    'react-dom',
    'prop-types',
    'react-immutable-render-mixin',
    'immutable',
    'd3-geo-projection',
    'babel-polyfill'
];
module.exports = {
    output: {
        path: dll,
        filename: "dll.[name].js",
        library: '[name]'
    },
    entry:{
        //bundle: [path.join(__dirname,'vendors.js')]
        bundle:vendors
    },
    plugins: [
        new webpack.DllPlugin({
            path:'[name]-manifest.json',
            name:'[name]',
            context:__dirname
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]/*,
    resolve: {
        root: __dirname,
        modulesDirectories: ["node_modules"]
    }*/
};