const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_, argv) => {
  const isProd = argv.mode === "production";

  return {
    mode: isProd ? "production" : "development",

    entry: "./src/index.js",

    output: {
      filename: isProd ? "[name].[contenthash].js" : "main.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },

    devtool: isProd ? "source-map" : "eval-source-map",

    devServer: {
      watchFiles: ["./src/**/*"],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/template.html",
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: "[name].[contenthash].css",
            }),
          ]
        : []),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
  };
};