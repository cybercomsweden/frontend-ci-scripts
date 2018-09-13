const path = require('path');
const fs = require('fs');
const readPkgUp = require('read-pkg-up');
const which = require('which');

const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

const appDirectory = path.dirname(pkgPath);
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function resolvePackagePath() {
  if (pkg.name === 'frontend-ci-scripts') {
    return require.resolve('../').replace(process.cwd(), '.');
  }
  return resolveBin('frontend-ci-scripts');
}

// eslint-disable-next-line complexity
function resolveBin(
  modName,
  { executable = modName, cwd = process.cwd() } = {}
) {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath);
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);

    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
}

function parseEnv(name, def) {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name]);
    } catch (err) {
      return process.env[name];
    }
  }
  return def;
}

function envIsSet(name) {
  return (
    process.env.hasOwnProperty(name) &&
    process.env[name] &&
    process.env[name] !== 'undefined'
  );
}

const fromRoot = (...p) => path.join(appDirectory, ...p);
const hasFile = (...p) => fs.existsSync(fromRoot(...p));

module.exports = {
  resolveApp,
  resolvePackagePath,
  resolveBin,
  parseEnv,
  hasFile,
};
