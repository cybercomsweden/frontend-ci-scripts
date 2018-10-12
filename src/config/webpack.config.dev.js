const path = require('path');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

const getCSSModuleLocalIdent = require('../utils/getCSSModuleLocalIdent');
const styleLoaders = require('./webpackUtils/styleLoaders');
const { resolveApp } = require('../utils/utils');
const paths = require('../utils/localAppConfigs');

const pluginLoader = require('./webpackUtils/pluginLoader');
const optimizationLoader = require('./webpackUtils/optimizationLoader');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  return styleLoaders(cssOptions, preProcessor, process.env.NODE_ENV);
};

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.

// const publicUrl = '';
const mode =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  mode: mode,
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'static/js/[name].chunk.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },

  optimization: optimizationLoader(process.env.NODE_ENV),
  resolve: {
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebook/create-react-app/issues/290
    extensions: ['.mjs', '.js', '.json', '.jsx'],
    alias: {
      // Resolve Babel runtime relative to react-scripts.
      // It usually still works on npm 3 without this but it would be
      // unfortunate to rely on, as react-scripts could be symlinked,
      // and thus @babel/runtime might not be resolvable from the source.
      '@babel/runtime': path.dirname(
        require.resolve('@babel/runtime/package.json')
      ),
    },
  },
  module: {
    strictExportPresence: true,

    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              baseConfig: {
                extends: [require.resolve('./eslintrc')],
              },
              ignore: false,
              useEslintrc: false,
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: resolveApp('src'),
        exclude: [/[/\\\\]node_modules[/\\\\]/],
      },

      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // Process application JS with Babel.
          // The preset includes JSX, Flow, and some ESnext features.
          {
            test: /\.(js|jsx|mjs)$/,
            include: [resolveApp('src')],
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            use: [
              // This loader parallelizes code compilation, it is optional but
              // improves compile time on larger projects
              {
                loader: require.resolve('thread-loader'),
                options: {
                  poolTimeout: Infinity, // keep workers alive for more effective watch mode
                },
              },
              {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  presets: [require.resolve('babel-preset-react-app')],

                  // This is a feature of `babel-loader` for webpack (not Babel itself).
                  // It enables caching results in ./node_modules/.cache/babel-loader/
                  // directory for faster rebuilds.
                  cacheDirectory: true,
                  highlightCode: true,
                },
              },
            ],
          },
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve('babel-preset-react-app/dependencies'),
                  { helpers: true },
                ],
              ],
              cacheDirectory: true,
              // Don't waste time on Gzipping the cache
              cacheCompression: false,
              // @remove-on-eject-begin

              // @remove-on-eject-end
              // If an error happens in a package, it's possible to be
              // because it was compiled. Thus, we don't want the browser
              // debugger to show the original code. Instead, the code
              // being evaluated would be much more helpful.
              sourceMaps: false,
            },
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          // By default we support CSS Modules with the extension .module.css
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
            }),
          },
          // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
          // using the extension .module.css
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent,
            }),
          },
          // Opt-in support for Less (using .less extensions).
          // Chains the less-loader with the css-loader and the style-loader
          // to immediately apply all styles to the DOM.
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, 'less-loader'),
          },
          // Adds support for CSS Modules, but using less
          // using the extension .module.less
          {
            test: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              'less-loader'
            ),
          },
          // Opt-in support for SASS (using .scss or .sass extensions).
          // Chains the sass-loader with the css-loader and the style-loader
          // to immediately apply all styles to the DOM.
          // By default we support SASS Modules with the
          // extensions .module.scss or .module.sass
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, 'sass-loader'),
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              'sass-loader'
            ),
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: pluginLoader(process.env.NODE_ENV),
};
