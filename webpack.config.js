let path = require("path")

// Plugins
let HTMLWebpackPlugin = require("html-webpack-plugin")
let { CleanWebpackPlugin } = require("clean-webpack-plugin")
let CopyWebpackPlugin = require("copy-webpack-plugin")
let MiniCssExtractPlugin = require("mini-css-extract-plugin")
let OptimizeCssAssetPlugin = require("optimize-css-assets-webpack-plugin")
let TerserWebpackPlugin = require("terser-webpack-plugin")
let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

let isProd = process.env.NODE_ENV === "production"
let isDev = !isProd


// Functions
let optimization = () => {
  let config = {
    splitChunks: {
      chunks: "all"
    }
  }
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

let jsLoaders = () => {
  let loaders = [{
    loader: "babel-loader",
    options: {
      presets: [
        "@babel/preset-env"
      ]
    }
  }]

  return loaders
}

let plugins = () => {
  let base = [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/img/favicon.ico"),
          to: path.resolve(__dirname, "dist")
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename("css")
    })
  ]

  if (isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}

let filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`



module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./app.js"]
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", ".json"],
    // Alias
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@css": path.resolve(__dirname, "src/scss"),
      "@js": path.resolve(__dirname, "src/js"),
      "@img": path.resolve(__dirname, "src/img"),
    }
  },
  optimization: optimization(),
  devServer: {
    open: true,
    compress: true,
    hot: true,
    port: 9000,
    watchFiles: ["src"],
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: ""
    }
  },
  devtool: isDev ? "source-map" : false,
  plugins: plugins(),


  // Loaders
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              url: false
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          "less-loader"
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "img",
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts",
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.xml/,
        use: ["xml-loader"]
      },
      {
        test: /\.csv/,
        use: ["csv-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-typescript"
            ]
          }
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react"
            ]
          }
        }
      },
    ]
  }
}