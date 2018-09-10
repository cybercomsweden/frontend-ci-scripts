const eslintFormatter = require('react-dev-utils/eslintFormatter');

const getCSSModuleLocalIdent = require('../../utils/getCSSModuleLocalIdent');
const paths = require('../../utils/localAppConfigs');

const styleLoaders = require('./styleLoaders');

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

module.exports = (env = 'development', shouldUseSourceMap = false) => ({
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
            // TODO: consider separate config for production,
            // e.g. to enable no-console and no-debugger only in production.
            baseConfig: {
              extends: [require.resolve('../eslintrc')],
            },
            // @remove-on-eject-begin
            ignore: false,
            useEslintrc: false,
            // @remove-on-eject-end
          },
          loader: require.resolve('eslint-loader'),
        },
      ],
      include: paths.appSrc,
      exclude: [/[/\\\\]node_modules[/\\\\]/],
    },
    {
      // "oneOf" will traverse all following loaders until one will
      // match the requirements. When no loader matches it will fall
      // back to the "file" loader at the end of the loader list.
      oneOf: [
        // "url" loader works just like "file" loader but it also embeds
        // assets smaller than specified size as data URLs to avoid requests.
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
          include: paths.appSrc,
          exclude: [/[/\\\\]node_modules[/\\\\]/],
          use: [
            // This loader parallelizes code compilation, it is optional but
            // improves compile time on larger projects
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [require.resolve('babel-preset-react-app')],
                highlightCode: true,
                compact: env === 'development',
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: env === 'production',
              },
            },
          ],
        },
        // Process any JS outside of the app with Babel.
        // Unlike the application JS, we only compile the standard ES features.
        {
          test: /\.js$/,
          use: [
            // This loader parallelizes code compilation, it is optional but
            // improves compile time on larger projects
            {
              loader: require.resolve('thread-loader'),
              options: getThreadOptions(env),
            },
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                compact: false,
                presets: [require.resolve('babel-preset-react-app')],
                cacheDirectory: true,
                highlightCode: true,
              },
            },
          ],
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // `MiniCSSExtractPlugin` extracts styles into CSS
        // files. If you use code splitting, async bundles will have their own separate CSS chunk file.
        // By default we support CSS Modules with the extension .module.css
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          loader: getStyleLoaders({
            importLoaders: 1,
            sourceMap: shouldUseSourceMap,
            getLocalIdent: getCSSModuleLocalIdent,
          }),
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: cssModuleRegex,
          loader: getStyleLoaders({
            importLoaders: 1,
            sourceMap: shouldUseSourceMap,
            modules: true,
          }),
        },
        // Opt-in support for Less (using .less extensions).
        // Chains the less-loader with the css-loader and the style-loader
        // to immediately apply all styles to the DOM.
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: shouldUseSourceMap,
            },
            'less-loader'
          ),
        },
        // Adds support for CSS Modules, but using less
        // using the extension .module.less
        {
          test: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: shouldUseSourceMap,
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
          loader: require.resolve('file-loader'),
          // Exclude `js` files to keep "css" loader working as it injects
          // it's runtime that would otherwise be processed through "file" loader.
          // Also exclude `html` and `json` extensions so they get processed
          // by webpacks internal loaders.
          exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
  ],
});

const getThreadOptions = env =>
  env === 'production'
    ? {
        poolTimeout: Infinity, // keep workers alive for more effective watch mode
      }
    : {};
