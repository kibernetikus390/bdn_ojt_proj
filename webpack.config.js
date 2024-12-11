const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // エントリーポイント
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // 出力ファイル
  },
  mode: 'development', // 開発モード
  module: {
    rules: [
      {
        test: /\.jsx?$/, // .js または .jsx ファイル
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Babel を使用
        },
      },
      {
        test: /\.css$/, // CSS ファイル
        use: ['style-loader', 'css-loader'], // CSS をバンドル
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // HTML テンプレート
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000, // 開発サーバーのポート
    open: true, // 自動でブラウザを開く
    hot: true, // ホットリロードを有効化
    watchFiles: ['src/**/*'], // 監視対象のファイル
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'], // 拡張子の省略
  },
  watchOptions: {
    poll: 1000, // ファイル変更のポーリング間隔（ミリ秒）
    ignored: /node_modules/, // 監視対象外
  },
};