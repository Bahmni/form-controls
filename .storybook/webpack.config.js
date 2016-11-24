// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add addional webpack configurations.
// For more information refer the docs: https://goo.gl/qPbSyX

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

'use strict';

let path = require('path');
let srcPath = path.join(__dirname, '../src');
module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    loaders: [
      // add your custom loaders.
      {
        test: /\.(scss|css)$/,
        loaders: ["style", "css", "sass"]
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
