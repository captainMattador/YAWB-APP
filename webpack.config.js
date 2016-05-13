
var webpack = require('webpack');
var path = require("path");
var PROD = JSON.parse(process.env.PROD_ENV || '0');

console.log(__dirname);
module.exports = {
  entry: "./app/App.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
            path.resolve(__dirname, 'app')
        ],
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins: PROD ? [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      unused: true,
      dead_code: true,
      warnings: false,
      screw_ie8: true
    },
    compressor: {
      warnings: false
    }
  })
  ] : []
}
