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
};
