const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist')
};

module.exports = {
    context: __dirname,
    mode: 'production',
    entry: {
        app: [PATHS.src],
        article: [`${PATHS.src}/article`]
    },
    output: {
        path: PATHS.dist,
        filename: 'js/[name].[chunkhash].min.js',
        publicPath: './'
    },
    optimization: {
        minimizer: [
            // 自定义js优化配置，将会覆盖默认配置
            new UglifyJsPlugin({
                exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
                cache: true,
                parallel: true, // 开启并行压缩，充分利用cpu
                sourceMap: false,
                extractComments: false, // 移除注释
                uglifyOptions: {
                    compress: {
                        unused: true,
                        warnings: false,
                        drop_debugger: true
                    },
                    output: {
                        comments: false
                    }
                }
            }),
        ],
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    enforce: true,
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        extensions: ['.js', '.jsx', '.jsm'],
        alias: {
            styles: path.resolve(__dirname, '../src/styles')
        }
    },
    module: {
        rules: [
            {
                test: /.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            camelCase: 'dashes',
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                          sourceMap: false,
                          config: {
                            path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
                          }
                        }
                      },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpg|png)$/,
                use: 'file-loader?limit=8192&name=global/img/[hash:8].[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: '../src/index.html',
            inlineSource: '.(css)$',
            filename: 'app.html',
            chunks: ['app', 'vendors', 'runtime']
        }),
        new HtmlWebpackPlugin({
            template: '../src/index.html',
            inlineSource: '.(css)$',
            filename: 'article.html',
            chunks: ['article', 'vendors', 'runtime']
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new InlineManifestWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(PATHS.src, 'favicon.ico'),
                to: path.join(PATHS.dist, 'favicon.ico')
            },
            {
                from: path.join(PATHS.src, 'demo/static.js'),
                to: path.join(PATHS.dist, 'static.js')
            }
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].min.css'
        }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            VERSION: JSON.stringify('1.2.0'),
            DEBUG: false
        })
    ]
};
