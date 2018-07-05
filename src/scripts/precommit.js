const path = require("path");
const spawn = require("cross-spawn");
const { resolveBin } = require("../utils/utils");

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");

const args = process.argv.slice(2);

const config = ["--config", hereRelative("../config/lintstagedrc.js")];

const pathToModule = resolveBin("lint-staged");

const lintStagedResult = spawn.sync(pathToModule, [...config, ...args], {
  stdio: "inherit",
});

if (lintStagedResult.status !== 0) {
  process.exit(lintStagedResult.status);
} else {
  // const validateResult = spawn.sync('npm', ['run', 'validate'], {
  //   stdio: 'inherit',
  // })

  process.exit(0);
}
