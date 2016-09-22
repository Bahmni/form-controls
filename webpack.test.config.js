'use strict';

let path = require('path');
let webpack = require('webpack');
let srcPath = path.join(__dirname, './src');

module.exports = {
  devtool: 'eval',
  entry: {
    helpers: ['./src/helpers/componentStore.js', './src/helpers/formRenderer.js'],
    bundle: './src/index.jsx'
  },
  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'test')
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    postLoaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(test|node_modules)\//,
        loader: 'istanbul-instrumenter'
      }
    ]

  },
  resolve: {
    alias: {
      components: srcPath + '/components/',
      src: srcPath
    }
  }
};
