process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const fs = require("fs");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const chalk = require("chalk");

const { resolveApp } = require("./../utils/utils");
const clearConsole = require("./../utils/clearConsole");

const isInteractive = process.stdout.isTTY;
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const webpackConfig = require("../config/webpack.config.dev.js");
const proxies = fs.existsSync(resolveApp("ServerProxy.js"))
  ? require(resolveApp("ServerProxy.js"))
  : undefined;

const devServer = new webpackDevServer(webpack(webpackConfig), {
  proxy: proxies,
  publicPath: "/",
  clientLogLevel: "none",
  historyApiFallback: true,
  compress: true,
  hot: true,
  open: true,
});
// Launch WebpackDevServer.
devServer.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }
  if (isInteractive) {
    clearConsole();
  }
  console.log(chalk.cyan("Starting the development server...\n"));

  ["SIGINT", "SIGTERM"].forEach(function(sig) {
    process.on(sig, function() {
      devServer.close();
      process.exit();
    });
  });
});
