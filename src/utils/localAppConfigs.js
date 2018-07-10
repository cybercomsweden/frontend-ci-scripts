const fs = require('fs');

const { resolveApp } = require('./utils');

const getLocalFile = relativeProjectFilePath =>
  fs.existsSync(resolveApp(relativeProjectFilePath))
    ? require(resolveApp(relativeProjectFilePath))
    : undefined;

module.exports = {
  getLocalProxies: () => getLocalFile('ServerProxy.js'),
  getLocalPackageJson: () => getLocalFile('package.json'),
  getYarnLock: () => getLocalFile('yarn.lock'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPublic: resolveApp('public'),
  appBuild: resolveApp('build'),
  appSrc: resolveApp('src'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  appPath: resolveApp('.'),
};
