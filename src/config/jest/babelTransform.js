const babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  presets: [require.resolve("babel-preset-react-app")],
  // @remove-on-eject-begin
  babelrc: false,
  // @remove-on-eject-end
});
