/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

'use strict';

let path = require('path');
let webpack = require('webpack');
let srcPath = path.join(__dirname, './src');

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
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'base64-inline-loader?name=/styles/images/[name].[ext]',
      },
    ],
  },
  resolve: {
    alias: {
      components: srcPath + '/components/',
      src: srcPath
    }
  }
};