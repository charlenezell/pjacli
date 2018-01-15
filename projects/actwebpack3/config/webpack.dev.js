let common = require("./webpack.common.js");
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const BrowserSyncPlugin =require("browser-sync-webpack-plugin");
let envOption = require("../scripts/env.js");

let prefix = envOption.staticRootURL;
module.exports = env => {
    return merge(common(env,"dev"), {
        plugins: [
            new BrowserSyncPlugin({
                proxy:envOption.bsProxy||null,
                injectChanges: false,
                ui:{
                    weinre:{
                        port:3003
                    }
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            // new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new ExtractTextPlugin({
                filename: "style/[name].css",
                // filename: "[name].css?[hash]-[chunkhash]-[contenthash]-[name]",
                disable: false,
                allChunks: true
            })/* ,
            new WriteFilePlugin({
                test: /\.jsp$/,
                force: true,
                log: true
            }) */
        ],
        output: {
            filename: 'script/[name].js',
            chunkFilename: 'script/[name].bundle.js',
            publicPath: prefix
        },
        devtool: 'source-map'
    })
}