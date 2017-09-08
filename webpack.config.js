const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');

const config = {
  entry: {
    App: './public/js/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
        {
            test: /\.(js)$/, 
            use: [{
              loader: 'babel-loader',
              options: { presets: ['es2015', 'stage-0'] }
            }]
        },  
        {
            test: /\.(scss)$/,
            use: ExtractTextPlugin.extract([
                'css-loader?url=false', 
                {
                    loader: 'postcss-loader',
                    options: {
                      url: false,
                      plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
                    }
                }, 
                'sass-loader'
            ])
        }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new OptimizeCssAssetsPlugin()
  ]
};

process.noDeprecation = true;

module.exports = config;