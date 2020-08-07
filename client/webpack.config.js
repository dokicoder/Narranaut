const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const envVariables = require('dotenv').config({ path: __dirname + '/.env' });
const { DefinePlugin } = require('webpack');

module.exports = env => {
  return {
    mode: env || 'development',
    name: 'StoryEditor',
    context: path.resolve(__dirname, 'src'),
    target: 'web',
    entry: './index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/],
          use: ['awesome-typescript-loader', 'eslint-loader'],
        },
        {
          test: /\.svg$/,
          use: 'svg-inline-loader',
        },
        {
          test: /\.(png|gif|jpg)$/,
          exclude: [/(node_modules)/],
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 50000,
                name: './images/[hash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsConfigPathsPlugin({
          tsconfig: __dirname + '/tsconfig.json',
          compiler: 'typescript',
        }),
      ],
    },
    devtool: 'inline-source-map',
    devServer: {
      proxy: { '/api/**': { target: 'http://localhost:3000', secure: false } },
      historyApiFallback: true,
    },
    optimization: {
      minimize: env === 'production',
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: './assets/template.html',
      }),
      new DefinePlugin({
        // for some reason define lpugin requires the env object to be a string?!
        'process.env': JSON.stringify(envVariables.parsed),
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
