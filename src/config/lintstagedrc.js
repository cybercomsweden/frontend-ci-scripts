const { resolvePackagePath } = require("../utils/utils");

const scriptPath = resolvePackagePath();

module.exports = {
  concurrent: false,
  linters: {
    "*.{js,json,less,css,ts,tsx,md}": [`npm run format`, "git add"],
    "*.{js,ts,tsx}": [
      `${scriptPath} lint`,
      `${scriptPath} test`,
      "git add",
    ],
  },
};
