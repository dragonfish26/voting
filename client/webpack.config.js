const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION = false;

module.exports = {
  entry: {
    votant: './public/js/votant.js',
    admin: './public/js/admin-vote.js'
  },
  output: {
    filename: '[name].bundle.js', 
    path: path.resolve(__dirname, '../server/public'), 
    clean: true, 
  },

  resolve: {
    extensions: ['.js']  
  },
  

  mode :  (PRODUCTION ? 'production' : 'development'),
  devtool : (PRODUCTION ? undefined : 'eval-source-map'),

  module: {
    rules: [
        {
          //test: /\.(m?js*)/,
          test: /\.(m?js)$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
              ]
            }
          }
        },
        //these 2 rules arent necessary if react is not used
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        },
        {
          test: /\.(png|jpg|gif)/i,
          use: [
            {
              loader: 'asset/resource',
              options: {
                name: '[path][name].[ext]',
              }
            }
          ]
        }
      ],
  },

  plugins: [

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'public', 'index.html'),

    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          to: path.resolve(__dirname, '../server/public'),  
          globOptions: {
            ignore: ['**/index.html'],  
          },
        },
      ],
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, '../server/public'), 
      watch: true
    },
    host: 'localhost',
    port: 9999, 
    open: true, 
  },
};

