const path = require("path");
const spawn = require("cross-spawn");
const { resolveBin } = require("../utils/utils");

const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), ".");

let args = process.argv.slice(2);

const config = ["--config", hereRelative("../config/eslintrc.js")];

const ignore = ["--ignore-path", hereRelative("../config/.eslintignore")];

const cache = args.includes("--no-cache") ? [] : ["--cache"];

const filesToApply = ["."];

const pathToModule = resolveBin("eslint");

const result = spawn.sync(
  pathToModule,
  [...config, ...ignore, ...cache, ...args, ...filesToApply],
  { stdio: "inherit" },
);

process.exit(result.status);
