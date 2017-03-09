var webpackTestCfg = require('./webpack.tdd.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    browsers: ['jsdom'],
    files: [
      'test/index.js'
    ],
    port: 8080,
    captureTimeout: 60000,
    browserNoActivityTimeout: 60000,
    frameworks: ['mocha', 'chai'],
    client: {
      mocha: {}
    },
    singleRun: false,
    autoWatch: true,
    reporters: ['progress'],
    mochaReporter: {
      showDiff: true,
      divider: '*'
    },
    preprocessors: {
      'test/index.js': ['webpack']
    },
    webpack: webpackTestCfg,
    webpackServer: {
      noInfo: true
    }
  });
};
