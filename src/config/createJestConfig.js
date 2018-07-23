const path = require('path');
const fs = require('fs');

const { resolveApp } = require('../utils/utils');

const here = p => path.join(__dirname, p);

module.exports = (rootdir, ci) => {
  const appSrc = resolveApp('src');
  const srcRoots = [appSrc];
  const rootDir = path.resolve(appSrc, '..');
  const toRelRootDir = f => '<rootDir>/' + path.relative(rootDir || '', f);
  const jestRootsArray = srcRoots.map(toRelRootDir);

  const setupTestsFile = fs.existsSync(resolveApp('src/setupTests.js'))
    ? '<rootDir>/src/setupTests.js'
    : undefined;

  return {
    setupTestFrameworkScriptFile: setupTestsFile,
    collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
    testMatch: [
      '**/__tests__/**/*.{js,jsx,mjs}',
      '**/?(*.)(spec|test).{js,jsx,mjs}',
    ],
    //   where to search for files/tests
    roots: jestRootsArray,
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|mjs)$': here('jest/babelTransform.js'),
      '^.+\\.css$': here('jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|css|json|graphql)$)': here('jest/fileTransform.js'),
    },
    moduleNameMapper: {
      '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
    transformIgnorePatterns: [
      '/node_modules/.+\\.(js|jsx|mjs)$',
      '^.+\\.module\\.(css|sass|scss)$',
    ],
    reporters: ci ? ['default', 'jest-junit'] : ['default'],
    // moduleNameMapper: {
    //   "^react-native$": "react-native-web",
    //   "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // },
    //   moduleFileExtensions: [
    //     "web.js",
    //     "js",
    //     "json",
    //     "web.jsx",
    //     "jsx",
    //     "node",
    //     "mjs",
    // ],
  };
};
