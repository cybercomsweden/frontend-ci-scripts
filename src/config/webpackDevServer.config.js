const publicPath = '/';

module.exports = function(proxy) {
  return {
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
