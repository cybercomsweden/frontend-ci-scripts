const fs = require('fs');

const { resolveApp } = require('./utils');

const getLocalFile = relativeProjectFilePath =>
  fs.existsSync(resolveApp(relativeProjectFilePath))
    ? require(resolveApp(relativeProjectFilePath))
    : undefined;

const localPackageJson = getLocalFile('package.json');

const resolvedProxy =
  localPackageJson.proxy === undefined
    ? undefined
    : localPackageJson.proxy.match(/.js/)
      ? getLocalFile(localPackageJson.proxy)
      : require(resolveApp('node_modules') + '/' + localPackageJson.proxy);

module.exports = {
  getLocalPackageJson: () => localPackageJson,
  getYarnLock: () => getLocalFile('yarn.lock'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src'),
  appPublic: resolveApp('public'),
  appBuild: resolveApp('build'),
  appSrc: resolveApp('src'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  appPath: resolveApp('.'),
  resolvedProxy: resolvedProxy,
};
