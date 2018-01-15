const path = require("path");

const glob = require("glob");
const webpack = require('webpack');
const HappyPack = require('happypack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const fs = require("fs");
const envSetting = require("../scripts/env");
var sprites = require('postcss-sprites');

// console.log(envSetting.sassLibPaths);
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const autoprefixer = require('autoprefixer');

var SpritesmithPlugin = require('webpack-spritesmith');

// const CopyWebpackPlugin = require("copy-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

let envOption = require("../scripts/env.js");

let prefix = envOption.staticRootURL;

function getComponentSpritePlugins() {
    return glob.sync(fromSrcRoot("component") + "/*").filter(function (v) {
        if (glob.sync(v + "/assets/sprite_*").length > 0) {
            return true;
        } else {
            return false;
        }
    }).map(v => {
        return glob.sync(v + "/assets/sprite_*").map(v2 => {
            function parseFolderName(_path) {
                let type = "png";//将来说不定可以加目录名字控制编译方式和zellsprite那样
                return {
                    fileType: type
                }
            }
            let options = parseFolderName(v);
            return new SpritesmithPlugin({
                src: {
                    cwd: path.resolve(v, 'assets'),
                    glob: '**/*.{png,jpg,jpeg}'
                },
                target: {
                    image: path.resolve(__dirname, `../src/sprite/spritedest/component_${path.basename(v)}_${path.basename(v2)}.${options.fileType}`),
                    css: [[path.resolve(__dirname, `../src/sprite/spritedest/component_${path.basename(v)}_${path.basename(v2)}.scss`), {
                        format: 'handlebars_based_template'
                    }]]
                },
                apiOptions: {
                    cssImageRef: `~component_${path.basename(v)}_${path.basename(v2)}.${options.fileType}`,
                    generateSpriteName: function (fp) {
                        // console.log(fp);
                        return "component_" + path.basename(v) + "_" + path.basename(v2) + "_" + path.basename(fp).replace(path.extname(fp), '');
                    }
                },
                spritesmithOptions: {
                    padding: 5
                },
                customTemplates: {
                    'handlebars_based_template': path.resolve(__dirname, "../src/sprite/css.hb")
                }
            })
        })
    }).reduce((acc, next) => {
        return acc.concat(next);
    }, [])
}

function fromSrcRoot(target) {
    return path.join("src", target);
}

function fromBuildRoot(target) {
    return path.join("build", target);
}

function getChunks(entryName, env) {
    let c = [entryName];
    c = c.concat(["manifest", "common"]);
    // let configs = {
    //     chat: {
    //         chunks: ["babelPolyfills", "jqueryVendor", "reactVendor"]
    //     },
    //     index: {
    //         chunks: ["babelPolyfills", "jqueryVendor", "reactVendor"]
    //     }
    // }
    let d = ["babelPolyfills", "jqueryVendor", "reactVendor"];
    //这里有个两难的问题，用external的话模块内依赖不能解析到external但是addasset不会因为依赖不全报错，而用dll的话不能分别add不同dll对于不同的entry，所以现在只能暂时加所有dll
    // let config = configs[entryName];
    // if (config) {
    //     d = config.chunks
    // }
    return {
        html: c,
        assets: d.map(v => {
            return env === "dev" ? `dll/${v}.js` : {
                path: "dll", glob: `${v}.*.js`
            }
        })
    };
}

function allEntryScript() {
    let t = {}
    glob.sync(fromSrcRoot("entry") + "/*.js").forEach(v => {
        w = [path.resolve("./", v)];
        w = ["babel-polyfill"].concat(w);
        // if (env == "dev") {
        //     w = ['webpack-dev-server/client?http://192.168.137.1:8898/', 'webpack/hot/only-dev-server', 'react-hot-loader/patch'].concat(w);
        // }
        t[path.basename(v, '.js')] = w;
    });

    // t.basecss = ["./src/assets/style/common/common.scss"];

    return t;
}

module.exports = function (envConfig,env) {
    if(!envConfig){
        envConfig={}
    }
    return {
        entry: allEntryScript(),
        output: {
            path: path.resolve("./build")
        },
        module: {
            rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'happypack/loader'
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true
                                    // modules: true,
                                    // importLoaders: 1,
                                    // localIdentName: '[path][name]__[local]--[hash:base64:5]'
                                }
                            }, {
                                loader: 'postcss-loader'
                            }
                        ]
                    }
                )
            }, {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: "[folder]_[name]"
                        }
                    },
                    "svgo-loader"
                ]
            }, {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 1,
                            name: 'assets/[name]_[hash:4].[ext]',
                        }
                    }
                ].concat([{
                    loader: 'image-webpack-loader',
                    options: {
                        debug: envConfig.buildType === "prod" ? false : true,
                        bypassOnDebug: true,
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: true,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        // // the webp option will enable WEBP
                        // webp: {
                        //     quality: 75
                        // }
                    },
                }].filter(v => {
                    if (envConfig.buildType === "prod") {
                        return true;
                    } else {
                        return false;
                    }
                })),
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader?sourceMap=true',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    // minimize: true
                                    minimize: envConfig.buildType === "prod" ? true : false
                                    // modules: true,
                                    // importLoaders: 1,
                                    // localIdentName: '[path][name]__[local]--[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true,
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            // flexbox: 'no-2009',这个神奇地干掉了一些属性。。。
                                        })/* ,
                                      sprites({
                                          stylesheetPath:"./build/style/",
                                          spritePath:"./build/assets/"
                                      }) */
                                    ],
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                    includePaths: envSetting.sassLibPaths
                                }
                            }
                        ]
                    }
                )
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }]
        },
        resolve: {

            // options for resolving module requests
            // (does not apply to resolving to loaders)
            //遇到未知的问题不知道是哪个东西和preact不兼容导致dev版有个死循环，但是神奇的是prod版没有这个问题
            // "alias":{
            //     "react":"preact-compat",
            //     "react-dom":"preact-compat"
            // },
            modules: [
                "node_modules", "src/sprite/spritedest", "src/assets/image"
            ],
            // directories where to look for modules

            extensions: [".js", ".json", ".jsx", ".css", ".scss"]
            // extensions that are used
        },

        plugins: [
            new HappyPack({
                // 3) re-add the loaders you replaced above in #1:
                loaders: ['babel-loader'],
                threads: 4,
                verbose: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ["common", "manifest"]
            })
        ]
            .concat(getComponentSpritePlugins())
            .concat(envConfig.noGenHTML ? [] : (Object.keys(allEntryScript()).map(key => {
                //默认加载所有抽取的common如果需要优化可以考虑手动在这里控制
                let chunksInfo = getChunks(key, env);
                // console.log(chunksInfo.assets);
                return [new HtmlWebpackPlugin({
                    inject: false,
                    chunks: chunksInfo.html,
                    filename: `${key}.html`,
                    template: `./templates/${key}.ejs`,
                    chunksSortMode: 'dependency'//按依赖排序
                }),
                new HtmlWebpackIncludeAssetsPlugin({
                    files: [`**/*${key}.jsp`],
                    assets: chunksInfo.assets,
                    append: false,
                    publicPath: true
                })
                ]
            })
                .reduce((acc, nextValue) => {
                    return acc.concat(nextValue);
                }, [])))
    }
}