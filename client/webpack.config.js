const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

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
          loader: 'awesome-typescript-loader',
        },
        {
          test: /\.(frag|vert)$/,
          exclude: [/node_modules/],
          loader: 'raw-loader',
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
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
      new TSLintPlugin({
        files: ['./src/**/*.ts{,x}'],
        project: 'tsconfig.json',
        typeCheck: true,
      }),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: './assets/template.html',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
