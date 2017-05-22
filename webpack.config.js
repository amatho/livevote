const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const OUT_PATH = path.resolve(__dirname, 'build');
const PUBLIC_PATH = '';
const IS_DEV = process.env.PROJ_ENV === 'development';
const IS_PROD = process.env.PROJ_ENV === 'production';

const CSS_LOADER_CONFIG = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      modules: true,
      localIdentName: '[name]__[local]--[hash:base64:5]',
      camelCase: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [require('autoprefixer')({grid: false})]
    }
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true
    }
  }
];

const MATERIAL_LOADER_CONFIG = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      modules: false,
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [require('autoprefixer')({grid: false})]
    }
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      includePaths: ['node_modules']
    }
  }
];

const HTML_TEMPLATES = [
  new HtmlWebpackPlugin({
    title: 'Index',
    // inject: false,
    minify: {
      collapseWhitespace: IS_PROD
    },
    template: path.resolve(__dirname, 'src/index.ejs')
  })
];

module.exports = [{
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
    vendor: ['preact', 'preact-router', 'preact-async-route', 'material-components-web', 'history', 'firebase', 'chart.js']
  },
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    filename: '[name].' + (IS_PROD ? '[chunkhash].min.' : '') + 'js'
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }, {
      test: /\.mdcscss/,
      use: IS_DEV ? [{loader: 'style-loader'}].concat(MATERIAL_LOADER_CONFIG) : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: MATERIAL_LOADER_CONFIG
      })
    }, {
      test: /\.scss$/,
      use: IS_DEV ? [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG) : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: CSS_LOADER_CONFIG
      })
    }]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    new ExtractTextPlugin('[name].' + (IS_PROD ? '[contenthash].min.' : '') + 'css'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    })
  ].concat(HTML_TEMPLATES).concat(IS_PROD ? [
    new BabiliPlugin({
      test: /\.js$/,
      babili: {
        presets: [
          [
            require('babel-preset-babili'),
            {
              mangle: {topLevel: true},
              deadcode: false,
              removeConsole: true
            }
          ]
        ]
      }
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardComments: {removeAll: true}
      }
    })
  ] : [])
}];
