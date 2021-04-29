const path = require('path');
const CLIEngine = require('eslint').CLIEngine;
const { hasFile } = require('../utils/utils');

const here = (p) => path.join(__dirname, p);
const hereRelative = (p) => here(p).replace(process.cwd(), '.');
const useBuiltinConfig = !hasFile('.eslintrc') && !hasFile('.eslintrc.js');

const config = useBuiltinConfig
  ? { configFile: require.resolve('../config/eslintrc.js') }
  : { useEslintrc: true };

const cli = new CLIEngine({
  ...config,
  fix: process.argv.slice(2).indexOf('--fix') >= 0,
});
const report = cli.executeOnFiles(['src/**/*.{js,jsx,mjs}']);
const formatter = cli.getFormatter();

// persist changed files when using --fix option
CLIEngine.outputFixes(report);
console.log(formatter(report.results));

if (report.errorCount > 0) {
  process.exit(1);
}
