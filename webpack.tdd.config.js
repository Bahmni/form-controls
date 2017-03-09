'use strict';

let config = require('./webpack.test.config');
config.devtool = 'source-map';
config.module.preLoaders = undefined;

module.exports = config;