const path = require('path');
const spawn = require('cross-spawn');
const { resolveBin } = require('../utils/utils');

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), '.');

const args = process.argv.slice(2);

const config = ['--config', hereRelative('../config/.prettierrc.js')];

const ignore = ['--ignore-path', hereRelative('../config/.prettierignore')];

const write = args.includes('--no-write') ? [] : ['--write'];
// this ensures that when running format as a pre-commit hook and we get
// the full file path, we make that non-absolute so it is treated as a glob,
// This way the prettierignore will be applied
const relativeArgs = args.map(a => a.replace(`${process.cwd()}/`, ''));

const filesToApply =
  relativeArgs.length > 0 ? [] : ['**/*.+(js|json|less|css|ts|tsx|md)'];

const pathToModule = resolveBin('prettier');
const result = spawn.sync(
  pathToModule,
  [...config, ...ignore, ...write, ...filesToApply].concat(relativeArgs),
  { stdio: 'inherit' },
);

process.exit(result.status);
