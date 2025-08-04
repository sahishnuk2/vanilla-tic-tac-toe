const { extension } = require("mime");
const path = require("path");
const { runtime } = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV ?? "development",
  entry: "./src/entrypoint.tsx",
  module: {
    rules: [
      //   {
      //     test: /.jsx?$/,
      //     exclude: /node_modules/,
      //     use: [
      //       {
      //         loader: "babel-loader",
      //         options: {
      //           presets: [
      //             "@babel/preset-env",
      //             ["@babel/preset-react", { runtime: "automatic" }],
      //           ],
      //         },
      //       },
      //     ],
      //   },
      {
        test: /.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
};
