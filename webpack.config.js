import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './src/index.ts',  // Точка входа
  output: {
    filename: 'main.js',
    path: path.resolve('./dist'),
    clean: true,
  },
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'], // чтобы Webpack понимал .ts файлы
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>FunChat</title>
        </head>
        <body></body>
        </html>
      `,
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
    historyApiFallback: true, // SPA навигация
    port: 8080,
  },
};