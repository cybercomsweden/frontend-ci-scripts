const { resolvePackagePath } = require('../utils/utils');

const scriptPath = resolvePackagePath().replace(/\\/g, '/');

module.exports = {
  concurrent: false,
  linters: {
    '**/*.+(js|jsx|json|less|css|ts|tsx|md)': [
      `npx ${scriptPath} format`,
      'git add',
    ],
    '**/*.+(js|jsx|ts|tsx)': [
      `npx ${scriptPath} lint`,
      `npx ${scriptPath} test`,
      'git add',
    ],
  },
};
