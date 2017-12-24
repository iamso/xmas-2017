const webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json');

let include = [
  /assets/,
  /bower_components/,
];
if (pkg.dependencies) {
  for (let dependency of Object.keys(pkg.dependencies)) {
    include.push(new RegExp(`node_modules/${dependency.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}/.*`, 'gi'));
  }
}

module.exports = {
  name: 'js',

  output: {
    publicPath: '/',
  },

  externals: {
    'jquery': 'jQuery',
  },

  resolve: {
    alias: {
    },
    modules: ['bower_components', 'node_modules'],
    descriptionFiles: ['bower.json', 'package.json'],
    mainFields: ['browser', 'main'],
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      // $: 'jquery',
      // jQuery: 'jquery',
      // 'window.jQuery': 'jquery'
    }),
  ],

  module: {
    loaders: [
      {
        loader: 'babel-loader',

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        include,

        // Options to configure babel with
        query: {
          plugins: ['transform-runtime'],
          presets: [
            ['env', {
              loose: true,
              modules: false
            }]
          ],
        }
      }
    ]
  }
};
