const path = require('path');
const paths = require('../utils/localAppConfigs');
const packageJson = paths.getLocalPackageJson();

const publicPath = '/';
const contentBase = [paths.appPublic];

if (packageJson.mocks) {
  contentBase.push(path.resolve(packageJson.mocks));
}

module.exports = function(proxy) {
  return {
    contentBase: contentBase,
    proxy: proxy,
    publicPath: publicPath,
    clientLogLevel: 'none',
    historyApiFallback: true,
    compress: true,
    hot: true,
    quiet: true,
    open: true,
  };
};
