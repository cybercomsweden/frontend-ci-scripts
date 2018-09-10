// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});
const { parseEnv } = require('../utils/utils');
const clearConsole = require('../utils/clearConsole');
const jest = require('jest');

const argv = process.argv.slice(2);

// Watch unless on CI, in coverage mode, or explicitly running all tests
const watch =
  !parseEnv('SCRIPTS_PRECOMMIT', false) &&
  !parseEnv('CI', false) &&
  argv.indexOf('--coverage') === -1 &&
  argv.indexOf('--watchAll') === -1;

if (!watch) {
  process.env.JEST_JUNIT_OUTPUT = './test-reports/junit.xml';
  argv.push('--bail');
} else {
  argv.push('--watch');
}

const createJestConfig = require('../config/createJestConfig');
const config = JSON.stringify(createJestConfig(process.cwd(), !watch));

argv.push('--config', config);

clearConsole();
jest.run(argv);
