process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const {
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const {
  getLocalPackageJson,
  useYarn,
  resolvedProxy,
} = require('../utils/localAppConfigs');
const webpackConfig = require('../config/webpack.config.dev.js');
const createDevServerConfig = require('../config/webpackDevServer.config');
const clearConsole = require('react-dev-utils/clearConsole');

const isInteractive = process.stdout.isTTY;
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

const appName = getLocalPackageJson().name;

const urls = prepareUrls(protocol, HOST, DEFAULT_PORT);
// Create a webpack compiler that is configured with custom messages.
const compiler = createCompiler(webpack, webpackConfig, appName, urls, useYarn);

const serverConfig = createDevServerConfig(resolvedProxy);
const devServer = new webpackDevServer(compiler, serverConfig);

// Launch WebpackDevServer.
devServer.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }
  if (isInteractive) {
    clearConsole();
  }
  console.log(chalk.cyan('Starting the development server...\n'));

  ['SIGINT', 'SIGTERM'].forEach(function(sig) {
    process.on(sig, function() {
      devServer.close();
      process.exit();
    });
  });
});
