const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production';
const SRC_DIR = __dirname + '/src';
const DIST_DIR = __dirname + '/dist';

module.exports = {
  entry: [
    SRC_DIR + '/index.jsx'
  ],
  output: {
    path: DIST_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {  test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          msName: '[name].[ext]?[hash]'
        }},
      {
        test: /\.(scss|sass|css)$/,
        exclude: [
          /node_modules/,
          /vendor/
        ],
        loaders: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[local]___[hash:base64:5]'
            }
          },
        'sass-loader',
        ]
      },
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: {minimize: true}
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'BACKEND_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL),
      'REVISION': JSON.stringify(process.env.REACT_APP_REVISION),
      'MIXPANEL_TOKEN': JSON.stringify(process.env.REACT_APP_MIXPANEL_TOKEN),
      'SENTRY_DSN': JSON.stringify(process.env.REACT_APP_SENTRY_DSN)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: SRC_DIR + '/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  devServer: {
    contentBase: DIST_DIR,
    historyApiFallback: true,
    hot: true,
    port: 9000,
    host: '0.0.0.0',
  }
};
