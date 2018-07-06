const { resolvePackagePath } = require('../utils/utils');

const scriptPath = resolvePackagePath().replace(/\\/g, '/');

module.exports = {
  concurrent: false,
  linters: {
    '**/*.+(js|json|less|css|ts|tsx|md)': [
      `npx ${scriptPath} format`,
      'git add',
    ],
    '**/*.+(js|ts|tsx)': [
      `npx ${scriptPath} lint`,
      `npx ${scriptPath} test`,
      'git add',
    ],
  },
};
