const path = require('path')

module.exports = {
  mode: "development",
  devtool: 'inline-source-map',

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: `./src/index.js`,

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: path.resolve(__dirname, 'dist/js'),
    // 出力ファイル名
    filename: "main.js"
  },

  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            // Babel を利用する
            loader: "babel-loader",
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2020 を ES5 に変換
                "@babel/preset-env",
              ],
            },
          },
        ],
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader'
        ]
      }
    ],
  },
  // ES5(IE11等)向けの指定
  target: ["web", "es5"],

  devServer: {
    open: true,
    port: 3000,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  }
};

