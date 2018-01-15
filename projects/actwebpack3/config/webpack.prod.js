let common = require("./webpack.common.js");
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
let envOption=require("../scripts/env.js");
module.exports = env => {
    let prefix = env.isTest?envOption.testStaticRootURL:envOption.staticRootURL;
    return merge(common(env), {
        cache: false,
        devtool: 'hidden-source-map',
        plugins: [
            new UglifyJSPlugin({
                sourceMap: true
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            // new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new ExtractTextPlugin({
                filename: "style/[name].[contenthash].css",
                // filename: "[name].css?[hash]-[chunkhash]-[contenthash]-[name]",
                disable: false,
                allChunks: true
            })
        ],
        output: {
            filename: 'script/[name].[chunkhash].js',
            chunkFilename: 'script/[name].[chunkhash].bundle.js',
            publicPath: prefix
        }
    })
}