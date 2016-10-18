'use strict';

let path = require('path');
let webpack = require('webpack');
let srcPath = path.join(__dirname, './src');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: {
    helpers: ['./src/helpers/componentStore.js', './src/helpers/formRenderer.js'],
    bundle: ['./src/index.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'FormControls'
  },
  plugins: [
    new CopyWebpackPlugin(
        [
          {
            from: path.join(__dirname, './styles/fonts'), to: path.join(__dirname, './dist/fonts'),
          },
        ],
        {copyUnmodified: true}
    ),
  ],
  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true,
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ],
  },
  resolve: {
    alias: {
      components: srcPath + '/components/',
      src: srcPath
    }
  }
};
