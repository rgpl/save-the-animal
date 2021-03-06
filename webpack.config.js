// Webpack build creation
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');


const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

let extraPlugins = [];
let removeLogs = false;
if (removeLogs) {
  extraPlugins.push(new UglifyJSPlugin({
    uglifyOptions: {
      compress: {
        drop_console: true
      }
    }
  }))
}

module.exports = {
    mode:'development',
    entry: {
        app: [
          '@babel/polyfill',
          path.resolve(__dirname,'src/index.js')
        ],
        vendor: ['pixi', 'p2', 'phaser']
    },
    devtool: 'source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './',
        filename: '[name].js'
    },
    optimization: {
        minimize:true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    watch: true,
    plugins: [
        definePlugin,
        new HtmlWebpackPlugin({
          filename: '../dist/index.html',
          template: './src/index.html',
          chunks: ['vendor', 'app'],
          chunksSortMode: 'manual',
          minify: {
            removeAttributeQuotes: false,
            collapseWhitespace: false,
            html5: false,
            minifyCSS: false,
            minifyJS: false,
            minifyURLs: false,
            removeComments: false,
            removeEmptyAttributes: false
          },
          hash: false
        }),
        new BrowserSyncPlugin({
          host: process.env.IP || 'localhost',
          port: process.env.PORT || 3000,
          server: {
            baseDir: ['./dist', './build']
          }
        }),
        new ExtractTextPlugin("style.css"),
        new CleanWebpackPlugin()
    ].concat(extraPlugins),
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /pixi\.js/,
                loader: ['expose-loader?PIXI']
            },
            {
                test: /phaser-split\.js$/,
                use: ['expose-loader?Phaser']
            },
            {
                test: /p2\.js/,
                loader: ['expose-loader?p2']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                   'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                   'file-loader'
                ]
            },
            {
                test: /\.(mp3|ogg)$/,
                use: [
                   'file-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
            }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    }
}
