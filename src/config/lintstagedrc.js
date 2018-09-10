const { resolvePackagePath } = require('../utils/utils');

const scriptPath = resolvePackagePath();
console.log(scriptPath);
module.exports = {
  concurrent: false,
  linters: {
    '**/*.+(js|jsx|json|less|css|ts|tsx|md)': [
      `${scriptPath} format`,
      'git add',
    ],
    '**/*.+(js|jsx|ts|tsx)': [
      `${scriptPath} lint`,
      `${scriptPath} test --findRelatedTests --passWithNoTests`,
      'git add',
    ],
  },
};
