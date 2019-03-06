#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const spawn = require('cross-spawn');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x =>
    x === 'lint' ||
    x === 'format' ||
    x === 'test' ||
    x === 'precommit' ||
    x === 'build' ||
    x === 'start'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'pre-commit':
  case 'lint':
  case 'format':
  case 'test':
  case 'start':
  case 'build': {
    const packageJson = require('../package.json');
    console.log(
      chalk.cyan(`Cybercom ${packageJson.name} ${packageJson.version}`)
    );
    const result = spawn.sync(
      'node',
      nodeArgs
        .concat(require.resolve('./scripts/' + script))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: 'inherit', env: getEnv() }
    );
    if (result.signal) {
      handleSignal(result);
    }
    process.exit(result.status);
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
    console.log('Perhaps you need to update the script package?');
    break;
}

function getEnv() {
  // this is required to address an issue in cross-spawn
  // https://github.com/kentcdodds/kcd-scripts/issues/4
  return Object.keys(process.env)
    .filter(key => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => {
        envCopy[key] = process.env[key];
        return envCopy;
      },
      {
        [`SCRIPTS_${script.toUpperCase()}`]: true,
      }
    );
}

function handleSignal(result) {
  if (result.signal === 'SIGKILL') {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    );
  } else if (result.signal === 'SIGTERM') {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    );
  }
  process.exit(1);
}
